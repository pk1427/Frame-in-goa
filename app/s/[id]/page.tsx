import Link from "next/link";
import { getCard } from "@/lib/store/shareStore";
import type { Metadata } from "next";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const record = await getCard(params.id);
  if (!record) {
    return { title: "Not found — Frame In Goa" };
  }

  const title = `${record.name || "Builder ID"} — Frame In Goa`;

  return {
    title,
    description: `Built my HH Goa Builder ID ${record.builderClass} #FrameInGoa`,
    openGraph: {
      title,
      description: `Built my HH Goa Builder ID #FrameInGoa`,
      images: [`/api/og/${params.id}`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: `Built my HH Goa Builder ID #FrameInGoa`,
      images: [`/api/og/${params.id}`],
    },
  };
}

export default async function SharePage({ params }: PageProps) {
  const record = await getCard(params.id);

  if (!record) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-mono text-ink">Card not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="font-display text-3xl md:text-4xl text-ink text-center mb-2">
        {record.name || "Builder ID"}
      </h1>
      <p className="font-mono text-coral text-center mb-8">
        {record.builderClass}
      </p>
      <img
        src={`/api/og/${params.id}`}
        alt="Frame In Goa"
        className="max-w-full max-h-[80vh] rounded-lg border border-sand"
      />
      <Link
        href="/"
        className="mt-8 font-mono text-sm text-lagoon hover:text-coral transition-colors"
      >
        Create your own
      </Link>
    </div>
  );
}
