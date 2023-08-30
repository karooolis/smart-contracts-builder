import "./globals.css";
import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Providers } from "./providers";
import Script from "next/script";

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
      <Script src="https://unpkg.com/prettier@latest" />
      <Script src="https://unpkg.com/prettier-plugin-solidity@latest" />

      <body className={inconsolatac.className} style={{ overflow: "hidden" }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
