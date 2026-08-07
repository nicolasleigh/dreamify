import { Credit } from "@/types/credit";
import { prisma } from "@/prisma";

export async function insertCredit(credit: Credit) {
  await prisma.credit.create({
    data: credit,
  });
}

export async function findCreditByTransNo(
  trans_no: string
): Promise<Credit | undefined> {
  const credit = await prisma.credit.findUnique({
    where: { trans_no },
  });

  return credit ?? undefined;
}

export async function findCreditByOrderNo(
  order_no: string
): Promise<Credit | undefined> {
  const credit = await prisma.credit.findFirst({
    where: { order_no },
  });

  return credit ?? undefined;
}

export async function getUserValidCredits(
  user_uuid: string
): Promise<Credit[] | undefined> {
  const now = new Date().toISOString();
  const credits = await prisma.credit.findMany({
    where: {
      user_uuid,
      expired_at: { gte: now },
    },
    orderBy: { expired_at: "asc" },
  });

  return credits;
}

export async function getCreditsByUserUuid(
  user_uuid: string,
  page: number = 1,
  limit: number = 50
): Promise<Credit[] | undefined> {
  const credits = await prisma.credit.findMany({
    where: { user_uuid },
    orderBy: { created_at: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return credits;
}
