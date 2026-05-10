import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { getCollection } from "@/lib/server/mongodb";
import { getSessionUserId } from "@/lib/server/session";
import { products } from "@/lib/data/products";
import type { CartItem, CheckoutInfo, DemoOrder } from "@/lib/local-store";

export type CartDocument = {
  ownerKey: string;
  items: CartItem[];
  updatedAt: string;
};

export type CheckoutDraftDocument = {
  ownerKey: string;
  draft: Partial<CheckoutInfo>;
  updatedAt: string;
};

export type OrderDocument = DemoOrder & {
  ownerKey: string;
  userId?: string;
};

const cartCookieName = "floaty_cart_id";
const lastOrderCookieName = "floaty_last_order_id";
const cookieMaxAge = 60 * 60 * 24 * 30;

export function getOwnerKey() {
  const userId = getSessionUserId();
  if (userId) return { ownerKey: `user:${userId}`, userId };

  const cookieStore = cookies();
  let cartId = cookieStore.get(cartCookieName)?.value;
  if (!cartId) {
    cartId = randomUUID();
    cookieStore.set(cartCookieName, cartId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: cookieMaxAge,
    });
  }

  return { ownerKey: `guest:${cartId}`, userId: undefined };
}

function getGuestOwnerKeyFromCookie() {
  const cartId = cookies().get(cartCookieName)?.value;
  return cartId ? `guest:${cartId}` : null;
}

export function setLastOrderCookie(orderId: string) {
  cookies().set(lastOrderCookieName, orderId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: cookieMaxAge,
  });
}

export function getLastOrderIdFromCookie() {
  return cookies().get(lastOrderCookieName)?.value || null;
}

export function sanitizeCartItems(items: CartItem[]) {
  return items
    .map((item) => ({
      productId: String(item.productId),
      quantity: Math.max(1, Number(item.quantity) || 1),
    }))
    .filter((item) => products.some((product) => product.id === item.productId));
}

export async function getCartItems(ownerKey: string) {
  const carts = await getCollection<CartDocument>("carts");
  const cart = await carts.findOne({ ownerKey });
  return cart?.items ?? [];
}

export async function setCartItems(ownerKey: string, items: CartItem[]) {
  const carts = await getCollection<CartDocument>("carts");
  const nextItems = sanitizeCartItems(items);
  await carts.updateOne(
    { ownerKey },
    {
      $set: {
        ownerKey,
        items: nextItems,
        updatedAt: new Date().toISOString(),
      },
    },
    { upsert: true },
  );
  return nextItems;
}

export async function mergeGuestCartIntoUserCart(userId: string) {
  const guestOwnerKey = getGuestOwnerKeyFromCookie();
  if (!guestOwnerKey) return;

  const userOwnerKey = `user:${userId}`;
  const [guestItems, userItems] = await Promise.all([getCartItems(guestOwnerKey), getCartItems(userOwnerKey)]);
  if (!guestItems.length) return;

  const mergedItems = [...userItems];
  guestItems.forEach((guestItem) => {
    const existingItem = mergedItems.find((item) => item.productId === guestItem.productId);
    if (existingItem) {
      existingItem.quantity += guestItem.quantity;
      return;
    }
    mergedItems.push(guestItem);
  });

  await setCartItems(userOwnerKey, mergedItems);

  const carts = await getCollection<CartDocument>("carts");
  await carts.deleteOne({ ownerKey: guestOwnerKey });
}
