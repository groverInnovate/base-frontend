'use client';
import type { Metadata } from 'next'
import './globals.css'
import './theme.css'
import { Providers } from './providers'
import sdk from '@farcaster/miniapp-sdk';
import React, { useEffect } from 'react';

export const metadata:  Metadata = {
  title: 'NFC Payment Mini App',
  description: 'Farcaster Mini App for NFC Payments on Base',
  openGraph: {
    title: 'NFC Payment Mini App',
    description: 'Pay with NFC using Base blockchain',
    images: ['/og-image.png'], // Add your OG image
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
	useEffect(() => {
    sdk.actions.ready();
  }, []);
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
