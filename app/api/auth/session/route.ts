import { NextResponse } from "next/server";
import { getSessionUser, toPublicUser } from "@/lib/server/session";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json({ user: user ? toPublicUser(user) : null });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể đọc phiên đăng nhập." },
      { status: 500 },
    );
  }
}
