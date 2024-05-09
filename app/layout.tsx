import {Inter} from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import {cn} from "@/lib/utils";
import React from "react";
import {Analytics} from "@vercel/analytics/react"
import {SpeedInsights} from "@vercel/speed-insights/next"
import {Return} from "@/components/ui/return";
import {ThemeProvider} from "next-themes";


const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: 'BUPF - Bath University Physics Forum',
    description: 'BUPF is a platform for Bath University students to ask physics-related questions and get answers from their peers and teachers.',
    openGraph: {
        title: 'BUPF - Bath University Physics Forum',
        description: 'Join BUPF to discuss physics topics, ask questions, and share knowledge with your Bath University peers.',
        url: 'https://www.bupf.co.uk/',
        siteName: 'BUPF - Bath University Physics Forum',
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
        <ThemeProvider>
            <TopBar/>
            <main className="flex-grow flex flex-col w-full items-center ">
                <div className={"mr-auto ml-6"}>
                    <Return/>
                </div>
                {children}
            </main>
        </ThemeProvider>
        </body>
        <Analytics/>
        <SpeedInsights/>
        </html>
    );
}
