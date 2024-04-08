import { Inter } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import {cn} from "@/lib/utils";

const inter = Inter({ subsets: ['latin'] })

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(inter.className, "px-2 sm:px-8")}>
      <body className="bg-background text-foreground items-center">
        <TopBar />
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
