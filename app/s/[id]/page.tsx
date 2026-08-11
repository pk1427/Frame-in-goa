import Link from "next/link";
import { getCard, getCombined } from "@/lib/store/shareStore";
import type { ShareRecord, CombinedFrameRecord } from "@/lib/store/shareStore";
import type { Metadata } from "next";
import { computeTeamClass } from "@/lib/render/teamClass";
import { JoinFlow } from "@/components/builder/JoinFlow";

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

  const isCombined = record.mode === "combined";
  const isInProgress = isCombined && record.status === "in_progress";

  if (isInProgress) {
    const combined = record as CombinedFrameRecord;
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
        <JoinFlow
          id={params.id}
          slotsTotal={combined.slotsTotal}
          onJoined={() => window.location.reload()}
        />
      </div>
    );
  }

  const builderClass =
    record.mode === "combined" ? "TEAM FRAME" : record.builderClass;

  let teamInfo: { label: string; power: number } | null = null;
  let memberNames: string[] = [];

  if (isCombined && "builderClasses" in record && Array.isArray(record.builderClasses)) {
    teamInfo = computeTeamClass(record.builderClasses);
    memberNames = record.builderClasses
      .map((c, i) => ({ name: `Member ${i + 1}`, cls: c }))
      .filter((m) => m.cls && m.cls.trim().length > 0)
      .map((m) => m.name);
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-2xl flex flex-col items-center gap-6">
        <h1 className="font-display text-3xl md:text-4xl text-white text-center">
          {record.name || "Builder ID"}
        </h1>

        <div className="w-full max-w-md rounded-2xl border-2 border-sand bg-offwhite p-6 flex flex-col gap-4">
          <img
            src={`/api/og/${params.id}`}
            alt="Frame In Goa"
            className="w-full h-auto rounded-lg"
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-ink/60 uppercase tracking-wider">
                BUILDER CLASS
              </span>
              <span className="font-mono text-sm text-accent font-bold uppercase">
                {builderClass}
              </span>
            </div>

            {record.mode !== "combined" && record.stack && (
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-ink/60 uppercase tracking-wider">
                  STACK
                </span>
                <span className="font-mono text-sm text-ink font-bold uppercase">
                  {record.stack}
                </span>
              </div>
            )}

            {isCombined && teamInfo && (
              <div className="border-t-2 border-sand pt-3 mt-1 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-ink/60 uppercase tracking-wider">
                    TEAM CLASS
                  </span>
                  <span className="font-display text-lg text-primary font-bold">
                    {teamInfo.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-ink/60 uppercase tracking-wider">
                    POWER
                  </span>
                  <span className="font-mono text-lg text-pink font-bold">
                    {teamInfo.power}
                  </span>
                </div>
                {memberNames.length > 0 && (
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="font-mono text-xs text-ink/60 uppercase tracking-wider">
                      MEMBERS
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {memberNames.map((name, i) => (
                        <span
                          key={i}
                          className="font-mono text-xs text-ink bg-primary/10 px-2 py-1 rounded"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Link
          href="/build"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-accent text-ink font-mono font-bold text-sm uppercase tracking-wider px-6 py-3 border-2 border-accent hover:bg-primary hover:text-white transition-colors"
        >
          BUILD YOURS
        </Link>

        <p className="font-mono text-xs text-white/40 text-center uppercase tracking-wider">
          #FrameInGoa · HH GOA 2026
        </p>
      </div>
    </div>
  );
}
