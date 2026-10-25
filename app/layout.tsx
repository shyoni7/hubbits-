import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
