import { User } from "@/types/user";
import { getUuid } from "@/lib/hash";
import { getIsoTimestr } from "@/lib/time";
import { prisma } from "@/prisma";

export async function insertUser(user: User) {
  await prisma.user.create({
    data: {
      ...user,
      uuid: user.uuid || getUuid(),
    },
  });
}

export async function findUserByEmail(
  email: string
): Promise<User | undefined> {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  return user ?? undefined;
}

export async function findUserByUuid(uuid: string): Promise<User | undefined> {
  const user = await prisma.user.findUnique({
    where: { uuid },
  });

  return user ?? undefined;
}

export async function getUsers(
  page: number = 1,
  limit: number = 50
): Promise<User[] | undefined> {
  if (page < 1) page = 1;
  if (limit <= 0) limit = 50;

  const offset = (page - 1) * limit;

  const users = await prisma.user.findMany({
    orderBy: { created_at: "desc" },
    skip: offset,
    take: limit,
  });

  return users;
}

export async function updateUserInviteCode(
  user_uuid: string,
  invite_code: string
) {
  const updated_at = getIsoTimestr();
  await prisma.user.updateMany({
    where: { uuid: user_uuid },
    data: { invite_code, updated_at },
  });
}

export async function updateUserInvitedBy(
  user_uuid: string,
  invited_by: string
) {
  const updated_at = getIsoTimestr();
  await prisma.user.updateMany({
    where: { uuid: user_uuid },
    data: { invited_by, updated_at },
  });
}

export async function getUsersByUuids(user_uuids: string[]): Promise<User[]> {
  const users = await prisma.user.findMany({
    where: { uuid: { in: user_uuids } },
  });

  return users;
}

export async function findUserByInviteCode(invite_code: string) {
  const user = await prisma.user.findFirst({
    where: { invite_code },
  });

  return user ?? undefined;
}

export async function getUserUuidsByEmail(email: string) {
  const users = await prisma.user.findMany({
    where: { email },
    select: { uuid: true },
  });

  return users.map((user) => user.uuid);
}
