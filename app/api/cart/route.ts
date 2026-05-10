import { NextResponse } from "next/server";
import { getCartItems, getOwnerKey, setCartItems } from "@/lib/server/cart";
import type { CartItem } from "@/lib/local-store";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { ownerKey } = getOwnerKey();
    return NextResponse.json({ items: await getCartItems(ownerKey) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể đọc giỏ hàng." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { productId?: string; quantity?: number };
    if (!body.productId) {
      return NextResponse.json({ error: "Thiếu sản phẩm." }, { status: 400 });
    }

    const { ownerKey } = getOwnerKey();
    const items = await getCartItems(ownerKey);
    const quantity = Math.max(1, Number(body.quantity) || 1);
    const existingItem = items.find((item) => item.productId === body.productId);
    const nextItems = existingItem
      ? items.map((item) =>
          item.productId === body.productId ? { ...item, quantity: item.quantity + quantity } : item,
        )
      : [...items, { productId: body.productId, quantity }];

    return NextResponse.json({ items: await setCartItems(ownerKey, nextItems) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể thêm vào giỏ hàng." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { items?: CartItem[] };
    const { ownerKey } = getOwnerKey();
    return NextResponse.json({ items: await setCartItems(ownerKey, body.items || []) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể cập nhật giỏ hàng." },
      { status: 500 },
    );
  }
}
