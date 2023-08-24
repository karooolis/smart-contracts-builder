import "./globals.css";
import type { Metadata } from "next";
import { Inter, Inconsolata } from "next/font/google";

import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });
const inconsolatac = Inconsolata({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Contracts Builder",
  description: "No-code smart contracts builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inconsolatac.className} style={{ overflow: "hidden" }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
