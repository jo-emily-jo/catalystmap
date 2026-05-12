import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "CatalystMap",
  description:
    "Map the supply chain of major catalyst companies. Identify publicly traded suppliers, contractors, and infrastructure providers with evidence-based relationships.",
  metadataBase: new URL("https://getcatalystmap.com"),
  openGraph: {
    title: "CatalystMap",
    description:
      "Map the supply chain of major catalyst companies. Identify publicly traded suppliers, contractors, and infrastructure providers.",
    url: "https://getcatalystmap.com",
    siteName: "CatalystMap",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} flex min-h-screen flex-col font-sans`}
      >
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
