// import { OpenAI, toFile } from "openai";
// import { writeFile } from "fs/promises";
// import path from "path";
// import { randomUUID } from "crypto";
// import { createReadStream, unlinkSync } from "fs";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("image");
//     // const prompt = formData.get("prompt") || "Transform into Studio Ghibli style";

//     if (!file || typeof file === "string") {
//       return new Response(JSON.stringify({ error: "No image provided" }), { status: 400 });
//     }

//     // Save uploaded image to disk temporarily
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
//     const tempFilePath = path.join("/tmp", `${randomUUID()}.png`);
//     await writeFile(tempFilePath, buffer);

//     // Send to OpenAI
//     const response = await openai.images.edit({
//       image: await toFile(createReadStream(tempFilePath), null, { type: "image/png" }),
//       prompt: "Transform into Studio Ghibli style",
//       n: 1,
//       // size: "512x512",
//       size: "256x256",
//       response_format: "url",
//       model: "dall-e-2",
//     });

//     // Clean up
//     unlinkSync(tempFilePath);

//     return Response.json({ result: response.data[0].url });
//   } catch (err) {
//     console.error(err);
//     return new Response(JSON.stringify({ error: "Image editing failed", detail: err.message }), {
//       status: 500,
//     });
//   }
// }

import { JSONValue, experimental_generateImage as generateImage } from "ai";
import { respData, respErr } from "@/lib/resp";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { createReadStream, unlinkSync } from "fs";
import type { ImageModelV1 } from "@ai-sdk/provider";
import { getUuid } from "@/lib/hash";
import { kling } from "@/aisdk/kling";
import { newStorage } from "@/lib/storage";
import cloudinary from "@/aisdk/cloudinary/cloudinary";
import { prisma } from "@/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const prmt = formData.get("prompt");
    console.log("prmt:----", prmt);
    if (!file || typeof file === "string") {
      return new Response(JSON.stringify({ error: "No image provided" }), { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFilePath = path.join("/tmp", `${randomUUID()}.png`);
    await writeFile(tempFilePath, buffer);

    const prompt =
      JSON.stringify(prmt) ||
      "Transform this image into a Studio Ghibli style scene: soft, hand-drawn look, pastel and warm colors, cinematic composition, watercolor texture, dreamy lighting, whimsical and serene atmosphere. Inspired by “My Neighbor Totoro” and “Spirited Away”.";
    const model = "kling-v1";

    let imageModel: ImageModelV1;
    let providerOptions: Record<string, Record<string, JSONValue>> = {};

    imageModel = kling.image(model);
    providerOptions = {
      kling: {
        image: buffer.toString("base64"),
        // image_reference: "subject", // kling-v1-5
        aspect_ratio: "1:1",
      },
    };

    const { images, warnings } = await generateImage({
      model: imageModel,
      prompt: prompt,
      n: 1,
      providerOptions,
    });

    if (warnings.length > 0) {
      console.log("gen images warnings:", warnings);
      return respErr("gen images failed");
    }

    // if (image[0]) {
    //   const { secure_url: url } = await cloudinary.uploader.upload(image[0].path, {
    //     folder: "ai",
    //   });
    // }

    // const storage = newStorage();

    // const batch = getUuid();

    const processedImages = await Promise.all(
      images.map(async (image, index) => {
        // const filename = `kling_${batch}_${index}.png`;
        // const key = `kling/${filename}`;
        // const body = Buffer.from(image.base64, "base64");

        try {
          // Add data URI prefix if it's missing
          const dataUri = image.base64.startsWith("data:") ? image.base64 : `data:image/png;base64,${image.base64}`;
          const { secure_url: url } = await cloudinary.uploader.upload(dataUri, {
            folder: "ai",
          });

          await prisma.generatedImages.create({
            data: {
              imageUrl: url,
            },
          });
          return respData(url);
        } catch (err) {
          console.log("upload file failed:", err);
        }
      })
    );

    return respData(processedImages);
  } catch (err) {
    console.log("gen image failed:", err);
    return respErr("gen image failed");
  }
}
