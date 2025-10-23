import type { Metadata } from "next";
import { Inter, Spline_Sans } from "next/font/google";
import "@/app/globals.css";
import { AppProvider } from "@/providers/app-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spline = Spline_Sans({ subsets: ["latin"], variable: "--font-spline" });

export const metadata: Metadata = {
  title: "PulseCheck",
  description: "Attendance with warmth and precision for modern classrooms.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans text-foreground", inter.variable, spline.variable)}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
