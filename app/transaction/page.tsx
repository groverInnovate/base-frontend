'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { baseSepolia } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import TransactionApp from '../components/TransactionApp';
import { ArrowLeft, User, Nfc, Wallet } from 'lucide-react';

// Create a wagmi config
const config = getDefaultConfig({
  appName: 'NFC Payment App',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'test',
  chains: [baseSepolia],
  ssr: false,
});

const queryClient = new QueryClient();

export default function TransactionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [transactionData, setTransactionData] = useState({
    address: '',
    amount: '',
    name: '',
    mode: 'manual' as 'contact' | 'nfc' | 'manual',
  });

  // ✅ Helper function to validate and cast mode
  const getValidMode = (modeParam: string | null): 'contact' | 'nfc' | 'manual' => {
    if (modeParam === 'contact' || modeParam === 'nfc' || modeParam === 'manual') {
      return modeParam;
    }
    return 'manual'; // Default fallback
  };

  useEffect(() => {
    // Parse URL parameters
    const address = searchParams.get('address') || '';
    const amount = searchParams.get('amount') || '';
    const name = decodeURIComponent(searchParams.get('name') || '');
    const modeParam = searchParams.get('mode');
    
    // ✅ Use the helper function to ensure type safety
    const mode = getValidMode(modeParam);

    setTransactionData({ address, amount, name, mode });
  }, [searchParams]);

  const getHeaderInfo = () => {
    switch (transactionData.mode) {
      case 'contact':
        return {
          icon: <User className="w-6 h-6 text-blue-600" />,
          title: transactionData.name ? `Pay ${transactionData.name}` : 'Pay Contact',
          subtitle: 'From your contacts'
        };
      case 'nfc':
        return {
          icon: <Nfc className="w-6 h-6 text-green-600" />,
          title: 'NFC Payment',
          subtitle: transactionData.name ? `Pay ${transactionData.name}` : 'Tap to pay detected'
        };
      default:
        return {
          icon: <Wallet className="w-6 h-6 text-purple-600" />,
          title: 'Send Payment',
          subtitle: 'Manual transaction'
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_CDP_PROJECT_ID}
          chain={baseSepolia}
          config={{ analytics: false }}
        >
          <MiniKitProvider chain={baseSepolia}>
            <div className="min-h-screen bg-gray-50">
              {/* Header */}
              <div className="bg-white shadow-sm px-4 py-4">
                <div className="max-w-md mx-auto flex items-center space-x-4">
                  <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="flex items-center space-x-3">
                    {headerInfo.icon}
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">{headerInfo.title}</h1>
                      <p className="text-sm text-gray-600">{headerInfo.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Form */}
              <div className="max-w-md mx-auto p-4">
                <TransactionApp
                  initialAddress={transactionData.address}
                  initialAmount={transactionData.amount}
                  contactName={transactionData.name}
                  mode={transactionData.mode} // ✅ Now properly typed
                />
              </div>
            </div>
          </MiniKitProvider>
        </OnchainKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

