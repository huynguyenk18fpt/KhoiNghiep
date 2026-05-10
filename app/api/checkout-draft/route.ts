import { NextResponse } from "next/server";
import { getCollection } from "@/lib/server/mongodb";
import { getOwnerKey, type CheckoutDraftDocument } from "@/lib/server/cart";
import type { CheckoutInfo } from "@/lib/local-store";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { ownerKey } = getOwnerKey();
    const drafts = await getCollection<CheckoutDraftDocument>("checkoutDrafts");
    const draft = await drafts.findOne({ ownerKey });
    return NextResponse.json({ draft: draft?.draft ?? {} });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể đọc bản nháp checkout." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { draft?: Partial<CheckoutInfo> };
    const { ownerKey } = getOwnerKey();
    const drafts = await getCollection<CheckoutDraftDocument>("checkoutDrafts");
    const draft = body.draft || {};

    await drafts.updateOne(
      { ownerKey },
      {
        $set: {
          ownerKey,
          draft,
          updatedAt: new Date().toISOString(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json({ draft });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể lưu bản nháp checkout." },
      { status: 500 },
    );
  }
}
