'use client';

import { useEffect, useState } from 'react';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { base } from 'viem/chains'; // Import the Base chain
import TransactionApp from './components/TransactionApp';

export default function Home() {
  return (
    <MiniKitProvider chain={base}>
      <div className="container">
        <TransactionApp />
      </div>
    </MiniKitProvider>
  );
}

