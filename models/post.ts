import { Post } from "@/types/post";
import { getUuid } from "@/lib/hash";
import { prisma } from "@/prisma";

export enum PostStatus {
  Created = "created",
  Deleted = "deleted",
  Online = "online",
  Offline = "offline",
}

export async function insertPost(post: Post) {
  await prisma.post.create({
    data: {
      ...post,
      uuid: post.uuid || getUuid(),
    },
  });
}

export async function updatePost(uuid: string, post: Partial<Post>) {
  await prisma.post.updateMany({
    where: { uuid },
    data: post,
  });
}

export async function findPostByUuid(uuid: string): Promise<Post | undefined> {
  const post = await prisma.post.findUnique({
    where: { uuid },
  });

  return post ?? undefined;
}

export async function findPostBySlug(
  slug: string,
  locale: string
): Promise<Post | undefined> {
  const post = await prisma.post.findFirst({
    where: { slug, locale },
  });

  return post ?? undefined;
}

export async function getAllPosts(
  page: number = 1,
  limit: number = 50
): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    orderBy: { created_at: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return posts;
}

export async function getPostsByLocale(
  locale: string,
  page: number = 1,
  limit: number = 50
): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: {
      locale,
      status: PostStatus.Online,
    },
    orderBy: { created_at: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return posts;
}
