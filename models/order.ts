import { Order } from "@/types/order";
import { prisma } from "@/prisma";

export enum OrderStatus {
  Created = "created",
  Paid = "paid",
  Deleted = "deleted",
}

export async function insertOrder(order: Order) {
  await prisma.order.create({
    data: order,
  });
}

export async function findOrderByOrderNo(
  order_no: string
): Promise<Order | undefined> {
  const order = await prisma.order.findUnique({
    where: { order_no },
  });

  return order ?? undefined;
}

export async function getFirstPaidOrderByUserUuid(
  user_uuid: string
): Promise<Order | undefined> {
  const order = await prisma.order.findFirst({
    where: {
      user_uuid,
      status: "paid",
    },
    orderBy: { created_at: "asc" },
  });

  return order ?? undefined;
}

export async function getFirstPaidOrderByUserEmail(
  user_email: string
): Promise<Order | undefined> {
  const order = await prisma.order.findFirst({
    where: {
      user_email,
      status: "paid",
    },
    orderBy: { created_at: "asc" },
  });

  return order ?? undefined;
}

export async function updateOrderStatus(
  order_no: string,
  status: string,
  paid_at: string,
  paid_email: string,
  paid_detail: string
) {
  await prisma.order.updateMany({
    where: { order_no },
    data: { status, paid_at, paid_detail, paid_email },
  });
}

export async function updateOrderSession(
  order_no: string,
  stripe_session_id: string,
  order_detail: string
) {
  await prisma.order.updateMany({
    where: { order_no },
    data: { stripe_session_id, order_detail },
  });
}

export async function updateOrderSubscription(
  order_no: string,
  sub_id: string,
  sub_interval_count: number,
  sub_cycle_anchor: number,
  sub_period_end: number,
  sub_period_start: number,
  status: string,
  paid_at: string,
  sub_times: number,
  paid_email: string,
  paid_detail: string
) {
  await prisma.order.updateMany({
    where: { order_no },
    data: {
      sub_id,
      sub_interval_count,
      sub_cycle_anchor,
      sub_period_end,
      sub_period_start,
      status,
      paid_at,
      sub_times,
      paid_email,
      paid_detail,
    },
  });
}

export async function getOrdersByUserUuid(
  user_uuid: string
): Promise<Order[] | undefined> {
  const orders = await prisma.order.findMany({
    where: {
      user_uuid,
      status: "paid",
    },
    orderBy: { created_at: "desc" },
  });

  return orders;
}

export async function getOrdersByUserEmail(
  user_email: string
): Promise<Order[] | undefined> {
  const orders = await prisma.order.findMany({
    where: {
      user_email,
      status: "paid",
    },
    orderBy: { created_at: "desc" },
  });

  return orders;
}

export async function getOrdersByPaidEmail(
  paid_email: string
): Promise<Order[] | undefined> {
  const orders = await prisma.order.findMany({
    where: {
      paid_email,
      status: "paid",
    },
    orderBy: { created_at: "desc" },
  });

  return orders;
}

export async function getPaiedOrders(
  page: number,
  limit: number
): Promise<Order[] | undefined> {
  const orders = await prisma.order.findMany({
    where: { status: "paid" },
    orderBy: { created_at: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return orders;
}
