import type { Metadata } from "next";
import { imbue, victorMono } from "@/lib/render/theme";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: "Frame In Goa",
  description: "HH Goa 2026 Open Trials — Built my HH Goa Builder ID",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${imbue.variable} ${victorMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
