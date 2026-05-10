import { NextResponse } from "next/server";
import { getCollection } from "@/lib/server/mongodb";
import {
  getCartItems,
  getOwnerKey,
  setCartItems,
  setLastOrderCookie,
  type OrderDocument,
} from "@/lib/server/cart";
import { hydrateCart, type CheckoutInfo } from "@/lib/local-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      customer?: CheckoutInfo;
      shippingFee?: number;
      discount?: number;
    };
    if (!body.customer) {
      return NextResponse.json({ error: "Thiếu thông tin nhận hàng." }, { status: 400 });
    }

    const { ownerKey, userId } = getOwnerKey();
    const items = hydrateCart(await getCartItems(ownerKey));
    if (!items.length) {
      return NextResponse.json({ error: "Giỏ hàng đang trống." }, { status: 400 });
    }

    const shippingFee = Number(body.shippingFee) || 0;
    const discount = Number(body.discount) || 0;
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const orderId = `FLT${Date.now().toString(36).toUpperCase()}`;
    const order: OrderDocument = {
      id: orderId,
      ownerKey,
      userId,
      createdAt: new Date().toISOString(),
      customer: body.customer,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        image: item.product.image,
        quantity: item.quantity,
        price: item.product.price,
      })),
      subtotal,
      shippingFee,
      discount,
      total: subtotal + shippingFee - discount,
      status: "processing",
    };

    const orders = await getCollection<OrderDocument>("orders");
    await orders.insertOne(order);
    await setCartItems(ownerKey, []);
    setLastOrderCookie(orderId);

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể tạo đơn hàng." },
      { status: 500 },
    );
  }
}
