import { NextResponse } from "next/server";
import { getCollection } from "@/lib/server/mongodb";
import { setSessionCookie, toPublicUser, type UserDocument } from "@/lib/server/session";
import { mergeGuestCartIntoUserCart } from "@/lib/server/cart";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: string;
      name?: string;
      email?: string;
      avatar?: string;
    };
    const email = body.email?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Google không trả về email hợp lệ." }, { status: 400 });
    }

    const users = await getCollection<UserDocument>("users");
    const now = new Date().toISOString();
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      await users.updateOne(
        { _id: existingUser._id },
        {
          $set: {
            name: body.name?.trim() || existingUser.name,
            avatar: body.avatar || existingUser.avatar,
            googleId: body.id || existingUser.googleId,
            provider: "google",
            updatedAt: now,
          },
        },
      );
      const nextUser = await users.findOne({ _id: existingUser._id });
      if (!nextUser) throw new Error("Không thể cập nhật người dùng Google.");
      setSessionCookie(nextUser._id.toString());
      await mergeGuestCartIntoUserCart(nextUser._id.toString());
      return NextResponse.json({ user: toPublicUser(nextUser) });
    }

    const result = await users.insertOne({
      name: body.name?.trim() || email,
      email,
      avatar: body.avatar,
      googleId: body.id,
      provider: "google",
      createdAt: now,
      updatedAt: now,
    });
    const user = await users.findOne({ _id: result.insertedId });
    if (!user) throw new Error("Không thể tạo người dùng Google.");

    setSessionCookie(user._id.toString());
    await mergeGuestCartIntoUserCart(user._id.toString());
    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Đăng nhập Google thất bại." },
      { status: 500 },
    );
  }
}
