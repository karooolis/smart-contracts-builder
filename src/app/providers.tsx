"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, sepolia, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  zora,
  goerli,
  localhost,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { useTheme } from "next-themes";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    goerli,
    sepolia,
    polygon,
    optimism,
    arbitrum,
    zora,
    localhost,
    // ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []),
  ],
  [
    // infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY }),
    alchemyProvider({ apiKey: "l9y1XpexuigDM7JeIYD3R32Qh9kXnGsq" }),
    publicProvider(),
  ]
);

const projectId = "368e129bd75ddd92d41f5bf7ac4cf1e6";

const { wallets } = getDefaultWallets({
  appName: "Smart Contracts Builder",
  projectId,
  chains,
});

const demoAppInfo = {
  appName: "Smart Contracts Builder",
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const { theme, resolvedTheme } = useTheme();
  React.useEffect(() => setMounted(true), []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        appInfo={demoAppInfo}
        theme={
          theme == "dark" || resolvedTheme === "dark"
            ? darkTheme()
            : lightTheme()
        }
      >
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
