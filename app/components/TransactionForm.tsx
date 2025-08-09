'use client';

import { useState, useCallback } from 'react';
import { Transaction, TransactionButton, TransactionStatus } from '@coinbase/onchainkit/transaction';
import { parseEther } from 'viem';
import { Shield, Send, Loader2 } from 'lucide-react';

interface TransactionFormProps {
  receiverAddress: string;
}

export default function TransactionForm({ receiverAddress }: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState<string>('');

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Create transaction calls array with proper typing
  const emptyData: `0x${string}` = '0x';
  const calls = [{
  to: receiverAddress as `0x${string}`,
  value: amount ? parseEther(amount) : BigInt(0),
   emptyData,
}];

  const handleOnSuccess = (response: any) => {
    console.log('Transaction successful:', response);
    if (response?.transactionReceipts?.[0]?.transactionHash) {
      setTransactionHash(response.transactionReceipts[0].transactionHash);
    }
    // Reset form after successful transaction
    setTimeout(() => {
      setAmount('');
      setTransactionHash('');
    }, 5000);
  };

  const handleOnError = (error: any) => {
    console.error('Transaction failed:', error);
  };

  return (
    <div className="space-y-6">
      {/* Receiver Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Shield className="w-4 h-4 inline mr-1" />
          Receiver Address
        </label>
        <div className="input read-only" title={receiverAddress}>
          {formatAddress(receiverAddress)}
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount (ETH)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.001"
          step="0.001"
          min="0"
          className="input"
        />
        <p className="text-xs text-gray-500 mt-1">
          Minimum: 0.001 ETH • Network: Base
        </p>
      </div>

      {/* Success Message */}
      {transactionHash && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">
            ✅ Transaction successful! Payment sent to {formatAddress(receiverAddress)}
          </p>
          <p className="text-xs text-gray-600 mt-1 break-all">
            TX: {transactionHash}
          </p>
        </div>
      )}

      {/* Transaction Component */}
      <Transaction
        calls={calls}
        onSuccess={handleOnSuccess}
        onError={handleOnError}
      >
        <TransactionButton
          text="Pay with Face ID"
          disabled={!receiverAddress || !amount || parseFloat(amount) <= 0}
          className="button button-primary flex items-center justify-center"
        />
        <TransactionStatus />
      </Transaction>

      <p className="text-xs text-gray-500 text-center">
        🔒 Your payment will be secured with Face ID authentication
      </p>
    </div>
  );
}

