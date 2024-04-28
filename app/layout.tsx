import {Inter} from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import {cn} from "@/lib/utils";
import React from "react";
import {Analytics} from "@vercel/analytics/react"
import {SpeedInsights} from "@vercel/speed-insights/next"


const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    title: 'BUPF',
    description: 'BUPF is a platform for students to ask questions and get answers from their peers and teachers.',
    openGraph: {
        title: 'BUPF',
        description: 'BUPF is a platform for students to ask questions and get answers from their peers and teachers.',
        url: 'https://www.bupf.co.uk/',
        siteName: 'BUFP',
        locale: 'en_UK',
        type: 'website',
    },
}

const inter = Inter({subsets: ["latin"]});


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
        <TopBar/>
        <main className="flex-grow flex flex-col w-full items-center ">
            {children}
        </main>
        </body>
        <Analytics/>
        <SpeedInsights/>
        </html>
    );
}
