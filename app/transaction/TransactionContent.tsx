'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TransactionApp from '../components/TransactionApp';

export default function TransactionContent() {
  const searchParams = useSearchParams();
  const [transactionData, setTransactionData] = useState({
    address: '',
    amount: '',
    contactName: '',
    mode: 'nfc' as const
  });

  useEffect(() => {
    const address = searchParams.get('address') || '';
    const amount = searchParams.get('amount') || '';
    const contactName = searchParams.get('name') || '';
    const token = searchParams.get('token') || 'USDC';

    setTransactionData({
      address,
      amount,
      contactName,
      mode: 'nfc'
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
