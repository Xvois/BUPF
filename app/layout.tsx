import {Inter} from "next/font/google";
import "./globals.css";
import {cn} from "@/utils/cn";
import React, {StrictMode} from "react";
import {Analytics} from "@vercel/analytics/react"
import {SpeedInsights} from "@vercel/speed-insights/next"
import TopBar from "@/components/TopBar";
import {Footer} from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";


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


export default function RootLayout({children}: { children: React.ReactNode; }) {
	return (
		<html lang="en" className={cn(inter.className, "w-full mx-auto",)}>
		<body className="flex flex-col bg-background text-foreground items-center min-h-screen">
		<StrictMode>
			{/* Loading UI */}
			<NextTopLoader
				color="hsl(var(--foreground))"
				initialPosition={0.08}
				crawlSpeed={200}
				height={3}
				crawl={true}
				showSpinner={false}
				easing="ease"
				speed={200}
				shadow="0 0 10px #2299DD,0 0 5px #2299DD"
				template='<div class="bar" role="bar"><div class="peg"></div></div>
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
				zIndex={1600}
				showAtBottom={false}
			/>

			{/* Top bar */}
			<TopBar/>


			{/* Main content */}
			<main className="flex-grow flex flex-col w-full items-center ">
				{children}
			</main>

			{/* Footer */}
			<Footer/>

			{/* Vercel Analytics */}
			<SpeedInsights/>
			<Analytics/>
		</StrictMode>
		</body>
		</html>
	);
}
