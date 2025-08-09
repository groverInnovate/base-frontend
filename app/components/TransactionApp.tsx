'use client';

import { useEffect, useState, useCallback } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import TransactionForm from './TransactionForm';
import LoadingSpinner from './LoadingSpinner';
import { Smartphone, Nfc, CreditCard, User, Wallet } from 'lucide-react';

interface TransactionAppProps {
  initialAddress?: string;
  initialAmount?: string;
  contactName?: string;
  mode?: 'contact' | 'nfc' | 'manual';
}

export default function TransactionApp({ 
  initialAddress = '', 
  initialAmount = '', 
  contactName = '', 
  mode = 'manual' 
}: TransactionAppProps) {
  const { isFrameReady, context, setFrameReady } = useMiniKit();
  const [receiverAddress, setReceiverAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const parseTransactionData = useCallback(() => {
    try {
      let address = initialAddress;
      let amountValue = initialAmount;

      // If no props provided, fallback to URL parsing (for direct links)
      if (!address && !amountValue) {
        const urlParams = new URLSearchParams(window.location.search);
        address = urlParams.get('address') || '';
        amountValue = urlParams.get('amount') || '';
      }

      console.log('Transaction ', { address, amountValue, contactName, mode });

      if (address) {
        // Validate Ethereum address format
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
          throw new Error('Invalid wallet address format');
        }
        setReceiverAddress(address);
        console.log('Receiver address set:', address);
      } else {
        setError('No receiver address provided');
      }

      // Set initial amount if provided
      if (amountValue) {
        setAmount(amountValue);
        console.log('Initial amount set:', amountValue);
      }
      
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse transaction data');
      setIsLoading(false);
    }
  }, [initialAddress, initialAmount, contactName, mode]);

  useEffect(() => {
    // Initialize MiniKit frame
    if (!isFrameReady) {
      setFrameReady();
    }
    
    // Parse transaction data when component mounts
    parseTransactionData();
  }, [isFrameReady, setFrameReady, parseTransactionData]);

  const getHeaderInfo = () => {
    switch (mode) {
      case 'contact':
        return {
          icon: <User className="w-6 h-6 text-blue-600" />,
          title: contactName ? `Pay ${contactName}` : 'Pay Contact',
          subtitle: 'From your Google contacts',
          bgColor: 'bg-blue-100'
        };
      case 'nfc':
        return {
          icon: <Nfc className="w-6 h-6 text-green-600" />,
          title: 'NFC Payment',
          subtitle: contactName ? `Pay ${contactName}` : 'Tap to pay detected',
          bgColor: 'bg-green-100'
        };
      default:
        return {
          icon: <Wallet className="w-6 h-6 text-purple-600" />,
          title: 'Send Payment',
          subtitle: 'Manual transaction',
          bgColor: 'bg-purple-100'
        };
    }
  };

  const headerInfo = getHeaderInfo();

  // Loading state
  if (isLoading) {
    return (
      <div className="card">
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">
            {mode === 'nfc' ? 'Processing NFC data...' : 
             mode === 'contact' ? 'Loading contact info...' : 
             'Loading payment data...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
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

  // Main transaction interface
  return (
    <div className="card">
      {/* Dynamic header based on payment mode */}
      <div className="flex items-center justify-center mb-6">
        <div className={`w-12 h-12 ${headerInfo.bgColor} rounded-full flex items-center justify-center mr-3`}>
          {headerInfo.icon}
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">{headerInfo.title}</h1>
          <p className="text-gray-600 text-sm">{headerInfo.subtitle}</p>
        </div>
      </div>

      {/* Payment mode indicator */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Payment Mode:</span>
          <span className="font-semibold text-gray-900 capitalize">
            {mode === 'nfc' ? 'NFC Tap' : 
             mode === 'contact' ? 'Contact Payment' : 
             'Manual Entry'}
          </span>
        </div>
        {contactName && (
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">Recipient:</span>
            <span className="font-semibold text-gray-900">{contactName}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600">Network:</span>
          <span className="font-semibold text-blue-600">Base Sepolia</span>
        </div>
      </div>

      {/* Transaction Form */}
      <TransactionForm 
        receiverAddress={receiverAddress}
        initialAmount={amount}
        contactName={contactName}
        mode={mode}
      />
    </div>
  );
}
