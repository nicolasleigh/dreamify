import { respData, respErr } from "@/lib/resp";
import { prisma } from "@/prisma";

export async function GET() {
  try {
    const images = await prisma.generatedImages.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
    });

    return respData(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return respErr("Failed to fetch images");
  }
}
