'use client';

import { useEffect, useState, useCallback } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import TransactionForm from './TransactionForm';
import LoadingSpinner from './LoadingSpinner';
import { Smartphone, Nfc, CreditCard } from 'lucide-react';

export default function TransactionApp() {
  const { isFrameReady, context, setFrameReady } = useMiniKit();
  const [receiverAddress, setReceiverAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const parseNFCData = useCallback(() => {
    try {
      // Parse URL parameters for NFC data
      const urlParams = new URLSearchParams(window.location.search);
      const address = urlParams.get('address');
      
      console.log('Parsed address from URL:', address); // Debug log
      
      if (address) {
        // Validate Ethereum address format
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
          throw new Error('Invalid wallet address format');
        }
        setReceiverAddress(address);
        console.log('Receiver address set:', address); // Debug log
      } else {
        setError('No receiver address found in NFC data');
      }
      
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse NFC data');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initialize MiniKit frame
    if (!isFrameReady) {
      setFrameReady();
    }
    
    // Parse NFC data when component mounts
    parseNFCData();
  }, [isFrameReady, setFrameReady, parseNFCData]);

  // Rest of your component remains the same...
  if (isLoading) {
    return (
      <div className="card">
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading NFC payment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-red-600 text-center">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="button button-primary mt-4 max-w-xs"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <Nfc className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">NFC Payment</h1>
          <p className="text-gray-600 text-sm">Secure payment on Base</p>
        </div>
      </div>

      <TransactionForm receiverAddress={receiverAddress} />
    </div>
  );
}
