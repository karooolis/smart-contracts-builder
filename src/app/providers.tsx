"use client";

import * as React from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
  getDefaultConfig,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  holesky,
  sepolia,
  optimism,
  arbitrum,
  zora,
  goerli,
  localhost,
} from "wagmi/chains";
import { useTheme } from "next-themes";

// const connectors = connectorsForWallets(
//   [
//     {
//       groupName: 'Recommended',
//       wallets: [rainbowWallet, walletConnectWallet],
//     },
//   ],
//   {
//     appName: 'Smart Contracts Builder',
//     projectId: '368e129bd75ddd92d41f5bf7ac4cf1e6',
//   }
// );

export const wagmiConfig = getDefaultConfig({
  appName: "Smart Contracts Builder",
  projectId:
    (process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string) ??
    "368e129bd75ddd92d41f5bf7ac4cf1e6",
  chains: [
    mainnet,
    goerli,
    holesky,
    sepolia,
    polygon,
    optimism,
    arbitrum,
    zora,
    localhost,
  ],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const { theme, resolvedTheme } = useTheme();
  React.useEffect(() => setMounted(true), []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={
              theme == "dark" || resolvedTheme === "dark"
                ? darkTheme()
                : lightTheme()
            }
          >
            {mounted && children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
