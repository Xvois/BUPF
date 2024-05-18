import {Inter} from "next/font/google";
import "./globals.css";
import {cn} from "@/utils/cn";
import React, {StrictMode} from "react";
import {Analytics} from "@vercel/analytics/react"
import {SpeedInsights} from "@vercel/speed-insights/next"
import TopBar from "@/components/TopBar";
import {Footer} from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import EmailPopup from "@/components/EmailPopup/EmailPopup";


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

const darkModeListener = `
window.addEventListener('DOMContentLoaded', (event) => {
	const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	const applyDarkMode = (e) => {
		if (e.matches) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	};

	// Apply dark mode if user preference is dark on page load
	applyDarkMode(darkModeMediaQuery);

	// Listen for changes in user's preference
	darkModeMediaQuery.addEventListener('change', applyDarkMode);
});
`

const inter = Inter({subsets: ["latin"]});


export default function RootLayout({children}: { children: React.ReactNode; }) {
	return (
		<html lang="en" className={cn(inter.className, "w-full mx-auto",)}>
		<body className="flex flex-col bg-background text-foreground items-center min-h-screen">
		<script dangerouslySetInnerHTML={{__html: darkModeListener}}/>
		<StrictMode>
			<NextTopLoader
				color="hsl(var(--foreground))"
				initialPosition={0.08}
				crawlSpeed={200}
				height={3}
				crawl={true}
				easing="ease"
				speed={200}
				shadow="0 0 10px #2299DD,0 0 5px #2299DD"
				template='<div class="bar" role="bar"><div class="peg"></div></div>
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
				zIndex={1600}
				showAtBottom={false}
			/>
			<TopBar/>
			<main className="flex-grow flex flex-col w-full items-center ">
				{children}
			</main>
			<EmailPopup/>
			<Footer/>
			<SpeedInsights/>
			<Analytics/>
		</StrictMode>
		</body>
		</html>
	);
}
