import {Inter} from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import {cn} from "@/lib/utils";
import {Metadata} from "next";
import React from "react";
import {Analytics} from "@vercel/analytics/react"
import {SpeedInsights} from "@vercel/speed-insights/next"


export const metadata: Metadata = {
    title: "BUPF",
    description:
        "Discuss physics topics, ask questions, and share knowledge with your peers, all in one place.",
    openGraph: {
        title: "BUPF",
        description:
            "Discuss physics topics, ask questions, and share knowledge with your peers, all in one place.",
        type: "website",
        url: "https://bupf.co.uk",
    },
    twitter: {
        title: "BUPF",
        description:
            "Discuss physics topics, ask questions, and share knowledge with your peers, all in one place.",
        card: "summary_large_image",
    },
};

const inter = Inter({subsets: ["latin"]});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html
          lang="en"
          className={cn(
              inter.className,
              "w-full mx-auto",
          )}
      >
      <body className="flex flex-col bg-background text-foreground items-center min-h-screen">
        <TopBar />
        <main className="flex-grow flex flex-col w-full items-center ">
          {children}
        </main>
      </body>
      <Analytics/>
      <SpeedInsights/>
    </html>
  );
}
