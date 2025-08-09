'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TransactionApp from '../components/TransactionApp';

type Mode = 'contact' | 'nfc' | 'manual';

interface TransactionData {
  address: string;
  amount: string;
  contactName: string;
  mode: Mode;
}

export default function TransactionContent() {
  const searchParams = useSearchParams();
  const [transactionData, setTransactionData] = useState<TransactionData>({
    address: '',
    amount: '',
    contactName: '',
    mode: 'manual'
  });

  useEffect(() => {
    const address = searchParams.get('address') || '';
    const amount = searchParams.get('amount') || '';
    const contactName = searchParams.get('name') || '';
    const modeParam = (searchParams.get('mode') || 'manual').toLowerCase();
    const mode: Mode = (modeParam === 'nfc' || modeParam === 'contact') ? (modeParam as Mode) : 'manual';

    setTransactionData({
      address,
      amount,
      contactName,
      mode,
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto">
        <TransactionApp
          initialAddress={transactionData.address}
          initialAmount={transactionData.amount}
          contactName={transactionData.contactName}
          mode={transactionData.mode}
        />
      </div>
    </div>
  );
}
