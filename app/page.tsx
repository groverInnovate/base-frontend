'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { baseSepolia } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import TransactionApp from './components/TransactionApp';

// Create a wagmi config
const config = getDefaultConfig({
  appName: 'NFC Payment App',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'test',
  chains: [baseSepolia],
});

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_CDP_PROJECT_ID}
          chain={baseSepolia}
        >
          <MiniKitProvider chain={baseSepolia}>
            <div className="container">
              <TransactionApp />
            </div>
          </MiniKitProvider>
        </OnchainKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
