'use client';

import { useState, useCallback } from 'react';
import { Transaction, TransactionButton, TransactionStatus } from '@coinbase/onchainkit/transaction';
import { Wallet, WalletDropdown, WalletDropdownLink, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity, EthBalance } from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';
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

  // Debug variables
  const isReceiverValid = !!receiverAddress;
  const isAmountValid = !!amount;
  const isAmountPositive = parseFloat(amount) > 0;
  const isButtonDisabled = !receiverAddress || !amount || parseFloat(amount) <= 0;

  return (
    <div className="space-y-6">
      {/* Wallet Connection Section */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Wallet Connection</h3>
        <Wallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address className={color.foregroundMuted} />
              <EthBalance />
            </Identity>
            <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">
              Wallet
            </WalletDropdownLink>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>

      {/* Debug Information */}
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-700 text-sm font-medium mb-1">Debug Info</p>
        <p className="text-yellow-600 text-xs">Receiver Address: {receiverAddress ? '✅ Valid' : '❌ Missing'}</p>
        <p className="text-yellow-600 text-xs">Amount: {amount ? '✅ Valid' : '❌ Missing'}</p>
        <p className="text-yellow-600 text-xs">Amount &gt; 0: {parseFloat(amount) > 0 ? '✅ Yes' : '❌ No'}</p>
        <p className="text-yellow-600 text-xs">Button Disabled: {isButtonDisabled ? '❌ Yes' : '✅ No'}</p>
      </div>

      {/* Receiver Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Shield className="w-4 h-4 inline mr-1" />
          Receiver Address
        </label>
        <div className="input read-only" title={receiverAddress}>
          {formatAddress(receiverAddress)}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Full address: {receiverAddress}
        </p>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount (ETH)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            console.log('Amount changed:', e.target.value);
            setAmount(e.target.value);
          }}
          placeholder="0.001"
          step="0.001"
          min="0"
          className="input"
        />
        <p className="text-xs text-gray-500 mt-1">
          Minimum: 0.001 ETH • Network: Base Sepolia Testnet
        </p>
      </div>

      {/* Success Message */}
      {transactionHash && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">
            ✅ Transaction successful! Payment sent to {formatAddress(receiverAddress)}
          </p>
          <p className="text-xs text-gray-600 mt-1 break-all">
            TX Hash: {transactionHash}
          </p>
          <a 
            href={`https://sepolia.basescan.org/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-xs underline hover:text-blue-800"
          >
            View on BaseScan →
          </a>
        </div>
      )}

      {/* Transaction Component */}
      <Transaction
        calls={calls}
        onSuccess={handleOnSuccess}
        onError={handleOnError}
      >
        <TransactionButton
          text={`Send Transaction ${isButtonDisabled ? '(Disabled)' : ''}`}
          disabled={isButtonDisabled}
          className={`button flex items-center justify-center w-full p-4 rounded-lg font-semibold ${
            isButtonDisabled 
              ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        />
        <TransactionStatus />
      </Transaction>

      {/* Testing Instructions */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700 text-sm font-medium mb-1">Testing Instructions</p>
        <ol className="text-blue-600 text-xs space-y-1 list-decimal list-inside">
          <li>Connect your wallet using the wallet section above</li>
          <li>Make sure you're on Base Sepolia testnet</li>
          <li>Get testnet ETH from <a href="https://bridge.base.org/deposit" target="_blank" className="underline">Base faucet</a></li>
          <li>Enter an amount and click "Send Transaction"</li>
        </ol>
      </div>
    </div>
  );
}

