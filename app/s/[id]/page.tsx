import Link from "next/link";
import { getCard, getCombined } from "@/lib/store/shareStore";
import type { ShareRecord, CombinedFrameRecord } from "@/lib/store/shareStore";
import type { Metadata } from "next";

type AnyRecord = (ShareRecord | CombinedFrameRecord) | null;

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const cardRecord = await getCard(params.id);
  const combinedRecord = await getCombined(params.id);
  const record: AnyRecord = cardRecord || combinedRecord;
  if (!record) {
    return { title: "Not found — Frame In Goa" };
  }

  const title = `${record.name || "Builder ID"} — Frame In Goa`;
  const builderClass =
    record.mode === "combined" ? "TEAM FRAME" : record.builderClass;

  return {
    title,
    description: `Built my HH Goa ${builderClass} #FrameInGoa`,
    openGraph: {
      title,
      description: `Built my HH Goa #FrameInGoa`,
      images: [`/api/og/${params.id}`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: `Built my HH Goa #FrameInGoa`,
      images: [`/api/og/${params.id}`],
    },
  };
}

export default async function SharePage({ params }: PageProps) {
  const cardRecord = await getCard(params.id);
  const combinedRecord = await getCombined(params.id);
  const record: AnyRecord = cardRecord || combinedRecord;

  if (!record) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
        <p className="font-mono text-xl text-white uppercase tracking-wider mb-4">
          CARD NOT FOUND
        </p>
        <p className="font-mono text-sm text-white/60 text-center mb-6">
          This frame expired after 14 days or the record was lost. Generate a new one.
        </p>
        <Link
          href="/"
          className="font-mono text-sm text-accent hover:text-white transition-colors uppercase tracking-wider"
        >
          BUILD A NEW ONE
        </Link>
      </div>
    );
  }

  const builderClass =
    record.mode === "combined" ? "TEAM FRAME" : record.builderClass;

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
      <h1 className="font-display text-3xl md:text-4xl text-white text-center mb-2">
        {record.name || "Builder ID"}
      </h1>
      <p className="font-mono text-accent text-center mb-8 uppercase tracking-wider">
        {builderClass}
      </p>
      <img
        src={`/api/og/${params.id}`}
        alt="Frame In Goa"
        className="max-w-full max-h-[80vh] rounded-lg border-2 border-sand"
      />
      <Link
        href="/"
        className="mt-8 font-mono text-sm text-pink hover:text-accent uppercase tracking-wider transition-colors"
      >
        BUILD YOUR OWN
      </Link>
    </div>
  );
}
