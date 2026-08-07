import { Feedback } from "@/types/feedback";
import { prisma } from "@/prisma";
import { getUsersByUuids } from "./user";

export async function insertFeedback(feedback: Feedback) {
  await prisma.feedback.create({
    data: feedback,
  });
}

export async function getFeedbacks(
  page: number = 1,
  limit: number = 50
): Promise<Feedback[] | undefined> {
  if (page < 1) page = 1;
  if (limit <= 0) limit = 50;

  const offset = (page - 1) * limit;

  const feedbacks = await prisma.feedback.findMany({
    orderBy: { created_at: "desc" },
    skip: offset,
    take: limit,
  });

  if (!feedbacks || feedbacks.length === 0) {
    return [];
  }

  const user_uuids = Array.from(
    new Set(feedbacks.map((item) => item.user_uuid))
  );
  const users = await getUsersByUuids(user_uuids);

  const result = feedbacks.map((item) => {
    const user = users.find((user) => user.uuid === item.user_uuid);
    return { ...item, user };
  });

  return result;
}
