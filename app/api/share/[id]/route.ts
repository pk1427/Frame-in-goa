import { NextResponse } from "next/server";
import { updateCombined } from "@/lib/store/shareStore";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { photoDataUrl, builderClass } = body;

    if (!photoDataUrl) {
      return NextResponse.json(
        { error: "Missing photoDataUrl" },
        { status: 400 }
      );
    }

    const updated = await updateCombined(id, { photoDataUrl, builderClass });

    if (!updated) {
      return NextResponse.json(
        { error: "Record not found or no longer accepting photos" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      slotsFilled: updated.photoDataUrls.length,
      slotsTotal: updated.slotsTotal,
      status: updated.status,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update frame" },
      { status: 500 }
    );
  }
}
