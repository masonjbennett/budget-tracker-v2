import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { FinanceProvider } from "@/context/FinanceContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Budget Tracker — Mason Bennett",
  description: "Personal finance management: tax estimation, budgeting, FIRE planning, investment projections.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex bg-bg antialiased">
        <FinanceProvider>
          <Sidebar />
          <main className="flex-1 ml-60 p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </FinanceProvider>
      </body>
    </html>
  );
}
