import cloudinary from "@/aisdk/cloudinary/cloudinary";
import { kling } from "@/aisdk/kling";
import { respData, respErr } from "@/lib/resp";
import { prisma } from "@/prisma";
import type { ImageModelV1 } from "@ai-sdk/provider";
import { JSONValue, experimental_generateImage as generateImage } from "ai";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const prmt = formData.get("prompt");
    if (!file || typeof file === "string") {
      return new Response(JSON.stringify({ error: "No image provided" }), { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const prompt =
      prmt ||
      // "Convert only the character into Studio Ghibli anime style. Keep the original background exactly the same. The character should have large expressive eyes, soft natural facial features, gentle blush on the cheeks, pastel cel-shading, clean anime line art, subtle shading, smooth skin texture, vivid but not saturated colors, detailed hair strands, illustrated in Hayao Miyazaki style. Background must remain photo-realistic and unmodified.";
      "A portrait of a young person in Studio Ghibli anime style, soft watercolor-like textures, expressive large eyes, animated facial features, darker light, subtle shading, smooth skin texture, painted with gentle pastel colors, clean cel-shaded line art, cinematic framing, highly detailed, art by Studio Ghibli, Hayao Miyazaki style";

    const model = "kling-v1";

    let imageModel: ImageModelV1;
    let providerOptions: Record<string, Record<string, JSONValue>> = {};

    // @ts-ignore
    imageModel = kling.image(model);
    providerOptions = {
      kling: {
        image: buffer.toString("base64"),
        aspect_ratio: "1:1",
      },
    };

    const { warnings, image } = await generateImage({
      model: imageModel,
      prompt: prompt as string,
      n: 1,
      providerOptions,
    });

    if (warnings.length > 0) {
      console.log("gen images warnings:", warnings);
      return respErr("gen images failed");
    }

    try {
      // Add data URI prefix if it's missing
      const dataUri = image.base64.startsWith("data:") ? image.base64 : `data:image/png;base64,${image.base64}`;
      const { secure_url: url } = await cloudinary.uploader.upload(dataUri, {
        folder: "ai",
        resource_type: "image",
        format: "webp",
      });

      await prisma.generatedImages.create({
        data: {
          imageUrl: url,
        },
      });
      return respData(url);
    } catch (err) {
      return respErr("upload file failed");
    }
  } catch (err) {
    console.log("gen image failed:", err);
    return respErr("gen image failed");
  }
}
