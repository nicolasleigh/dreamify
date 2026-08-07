import { Apikey } from "@/types/apikey";
import { prisma } from "@/prisma";

export enum ApikeyStatus {
  Created = "created",
  Deleted = "deleted",
}

export async function insertApikey(apikey: Apikey) {
  await prisma.apikey.create({
    data: apikey,
  });
}

export async function getUserApikeys(
  user_uuid: string,
  page: number = 1,
  limit: number = 50
): Promise<Apikey[] | undefined> {
  const offset = (page - 1) * limit;

  const apikeys = await prisma.apikey.findMany({
    where: {
      user_uuid,
      status: { not: ApikeyStatus.Deleted },
    },
    orderBy: { created_at: "desc" },
    skip: offset,
    take: limit,
  });

  return apikeys;
}

export async function getUserUuidByApiKey(
  apiKey: string
): Promise<string | undefined> {
  const apikey = await prisma.apikey.findFirst({
    where: {
      api_key: apiKey,
      status: ApikeyStatus.Created,
    },
  });

  return apikey?.user_uuid;
}
