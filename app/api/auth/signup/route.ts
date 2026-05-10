import { NextResponse } from "next/server";
import { getCollection } from "@/lib/server/mongodb";
import { hashPassword } from "@/lib/server/password";
import { setSessionCookie, toPublicUser, type UserDocument } from "@/lib/server/session";
import { mergeGuestCartIntoUserCart } from "@/lib/server/cart";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; email?: string; password?: string };
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password || "";

    if (!name || !email || password.length < 6) {
      return NextResponse.json({ error: "Vui lòng nhập tên, email và mật khẩu tối thiểu 6 ký tự." }, { status: 400 });
    }

    const users = await getCollection<UserDocument>("users");
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email này đã được dùng." }, { status: 409 });
    }

    const now = new Date().toISOString();
    const result = await users.insertOne({
      name,
      email,
      passwordHash: await hashPassword(password),
      provider: "password",
      createdAt: now,
      updatedAt: now,
    });
    const user = await users.findOne({ _id: result.insertedId });
    if (!user) throw new Error("Không thể tạo người dùng.");

    setSessionCookie(user._id.toString());
    await mergeGuestCartIntoUserCart(user._id.toString());
    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Đăng ký thất bại." },
      { status: 500 },
    );
  }
}
