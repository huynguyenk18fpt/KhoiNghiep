import { NextResponse } from "next/server";
import { getCollection } from "@/lib/server/mongodb";
import { getLastOrderIdFromCookie, getOwnerKey, type OrderDocument } from "@/lib/server/cart";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { ownerKey } = getOwnerKey();
    const lastOrderId = getLastOrderIdFromCookie();
    const orders = await getCollection<OrderDocument>("orders");
    const order = lastOrderId
      ? await orders.findOne({ id: lastOrderId })
      : await orders.findOne({ ownerKey }, { sort: { createdAt: -1 } });

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể đọc đơn hàng gần nhất." },
      { status: 500 },
    );
  }
}
