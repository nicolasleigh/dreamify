import { JSONValue, experimental_generateImage as generateImage } from "ai";
import { respData, respErr } from "@/lib/resp";

import type { ImageModelV1 } from "@ai-sdk/provider";
import { getUuid } from "@/lib/hash";
import { newStorage } from "@/lib/storage";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    // const { prompt } = await req.json();
    // if (!prompt) {
    //   return respErr("invalid params");
    // }

    let imageModel: ImageModelV1;
    let providerOptions: Record<string, Record<string, JSONValue>> = {};
    imageModel = openai.image("gpt-image-1");
    providerOptions = {
      openai: {
        quality: "medium",
        image: "",
      },
    };

    const { images, warnings } = await generateImage({
      model: imageModel,
      prompt:
        "Transform this image into a Studio Ghibli style scene: soft, hand-drawn look, pastel and warm colors, cinematic composition, watercolor texture, dreamy lighting, whimsical and serene atmosphere. Inspired by “My Neighbor Totoro” and “Spirited Away”.",
      n: 1,
      providerOptions,
    });

    if (warnings.length > 0) {
      console.log("gen images warnings:", warnings);
      return respErr("gen images failed");
    }

    const storage = newStorage();

    const batch = getUuid();

    const processedImages = await Promise.all(
      images.map(async (image, index) => {
        const filename = `openai_image_${batch}_${index}.png`;
        const key = `shipany/${filename}`;
        const body = Buffer.from(image.base64, "base64");

        try {
          const res = await storage.uploadFile({
            body,
            key,
            contentType: "image/png",
            disposition: "inline",
          });

          return {
            ...res,
            filename,
          };
        } catch (err) {
          console.log("upload file failed:", err);
          return {
            filename,
          };
        }
      })
    );

    return respData(processedImages);
  } catch (err) {
    console.log("gen image failed:", err);
    return respErr("gen image failed");
  }
}
