import { NextResponse } from "next/server";
import { saveCard, saveCombined } from "@/lib/store/shareStore";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mode, name, stack, builderClass, photoDataUrl, photoDataUrls } = body;

    if (!mode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (mode === "combined") {
      if (
        !photoDataUrls ||
        !Array.isArray(photoDataUrls) ||
        photoDataUrls.length === 0
      ) {
        return NextResponse.json(
          { error: "Missing required fields for combined frame" },
          { status: 400 }
        );
      }

      const id = await saveCombined({
        name: name || "",
        photoDataUrls,
      });

      return NextResponse.json({ id });
    }

    if (!photoDataUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = await saveCard({
      mode,
      name: name || "",
      stack: stack || "",
      builderClass: builderClass || "",
      photoDataUrl,
    });

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json(
      { error: "Failed to save card" },
      { status: 500 }
    );
  }
}
