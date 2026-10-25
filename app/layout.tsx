import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Vercel sets this to the production domain at build time. Next.js also
// falls back to it on Vercel, but being explicit keeps social image URLs
// correct everywhere.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: productionHost ? new URL(`https://${productionHost}`) : undefined,
  title: {
    default: "HabitFlow: build habits that stick",
    template: "%s · HabitFlow",
  },
  description:
    "A calm, minimal habit tracker. Check off your day, keep your streaks and see your week at a glance.",
};

export const viewport: Viewport = {
  themeColor: "#0a0b0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
