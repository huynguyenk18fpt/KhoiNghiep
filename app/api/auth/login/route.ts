import { NextResponse } from "next/server";
import { getCollection } from "@/lib/server/mongodb";
import { verifyPassword } from "@/lib/server/password";
import { setSessionCookie, toPublicUser, type UserDocument } from "@/lib/server/session";
import { mergeGuestCartIntoUserCart } from "@/lib/server/cart";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase();
    const password = body.password || "";

    if (!email || !password) {
      return NextResponse.json({ error: "Vui lòng nhập email và mật khẩu." }, { status: 400 });
    }

    const users = await getCollection<UserDocument>("users");
    const user = await users.findOne({ email });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: "Email hoặc mật khẩu không đúng." }, { status: 401 });
    }

    setSessionCookie(user._id.toString());
    await mergeGuestCartIntoUserCart(user._id.toString());
    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Đăng nhập thất bại." },
      { status: 500 },
    );
  }
}
