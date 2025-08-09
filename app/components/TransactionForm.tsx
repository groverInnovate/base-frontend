'use client';

import { useState, useCallback, useEffect } from 'react';
import { Transaction, TransactionButton, TransactionStatus } from '@coinbase/onchainkit/transaction';
import { Wallet, WalletDropdown, WalletDropdownLink, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity, EthBalance } from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';
import { parseEther } from 'viem';
import { Shield, Send, Loader2 } from 'lucide-react';

interface TransactionFormProps {
  receiverAddress: string;
  initialAmount?: string;        // ✅ Add this prop
  contactName?: string;          // ✅ Add this prop  
  mode?: 'contact' | 'nfc' | 'manual'; // ✅ Add this prop
}

export default function TransactionForm({ 
  receiverAddress, 
  initialAmount = '',     // ✅ Add default value
  contactName = '',       // ✅ Add default value
  mode = 'manual'         // ✅ Add default value
}: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState<string>('');

  // ✅ Set initial amount when component mounts
  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount);
    }
  }, [initialAmount]);

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

  console.log('Debug Info:', {
    receiverAddress,
    amount,
    initialAmount,
    contactName,
    mode,
    isReceiverValid,
    isAmountValid,
    isAmountPositive,
    isButtonDisabled
  });

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
        {/* ✅ Add mode and contact info to debug */}
        <p className="text-yellow-600 text-xs">Mode: {mode}</p>
        {contactName && <p className="text-yellow-600 text-xs">Contact: {contactName}</p>}
      </div>

      {/* Receiver Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Shield className="w-4 h-4 inline mr-1" />
          {/* ✅ Dynamic label based on mode */}
          {mode === 'contact' ? `Paying ${contactName || 'Contact'}` : 'Receiver Address'}
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
          // ✅ Make read-only for NFC mode with pre-filled amount
          readOnly={mode === 'nfc' && initialAmount ? true : false}
        />
        <p className="text-xs text-gray-500 mt-1">
          {/* ✅ Dynamic helper text based on mode */}
          {mode === 'nfc' && initialAmount ? 
            `Pre-filled amount from NFC: ${initialAmount} ETH` :
            'Minimum: 0.001 ETH • Network: Base Sepolia Testnet'
          }
        </p>
      </div>

      {/* Success Message */}
      {transactionHash && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">
            ✅ Transaction successful! Payment sent to {contactName || formatAddress(receiverAddress)}
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
          className={`w-full p-4 rounded-lg font-semibold ${
            isButtonDisabled 
              ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        />
        <TransactionStatus />
      </Transaction>

      {/* Testing Instructions */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700 text-sm font-medium mb-1">
          {mode === 'contact' ? 'Contact Payment' : 
           mode === 'nfc' ? 'NFC Payment' : 'Testing Instructions'}
        </p>
        <ol className="text-blue-600 text-xs space-y-1 list-decimal list-inside">
          <li>Connect your wallet using the wallet section above</li>
          <li>Make sure you're on Base Sepolia testnet</li>
          <li>Get testnet ETH from <a href="https://bridge.base.org/deposit" target="_blank" className="underline">Base faucet</a></li>
          <li>{amount ? 'Click "Send Transaction" to proceed' : 'Enter an amount and click "Send Transaction"'}</li>
        </ol>
      </div>
    </div>
  );
}

