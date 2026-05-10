import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getCollection } from "@/lib/server/mongodb";
import { getSessionUser, toPublicUser, type UserDocument } from "@/lib/server/session";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Bạn chưa đăng nhập." }, { status: 401 });
    }

    const body = (await request.json()) as { name?: string; avatar?: string };
    const name = body.name?.trim() || currentUser.name;
    const avatar = body.avatar || currentUser.avatar;

    const users = await getCollection<UserDocument>("users");
    await users.updateOne(
      { _id: new ObjectId(currentUser._id) },
      {
        $set: {
          name,
          avatar,
          updatedAt: new Date().toISOString(),
        },
      },
    );

    const nextUser = await users.findOne({ _id: currentUser._id });
    if (!nextUser) throw new Error("Không thể cập nhật hồ sơ.");

    return NextResponse.json({ user: toPublicUser(nextUser) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể cập nhật hồ sơ." },
      { status: 500 },
    );
  }
}
