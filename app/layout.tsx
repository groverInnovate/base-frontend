import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { MiniAppReady } from "./components/MiniAppReady";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_OG_TITLE || "NFC Payment Mini App",
  description:
    process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION ||
    "Farcaster Mini App for NFC Payments on Base",
  openGraph: {
    title: process.env.NEXT_PUBLIC_APP_OG_TITLE || "NFC Payment Mini App",
    description:
      process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION || "Pay with NFC using Base",
    images: [process.env.NEXT_PUBLIC_APP_OG_IMAGE || "/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appUrl = process.env.NEXT_PUBLIC_URL || "";
  const imageUrl = process.env.NEXT_PUBLIC_APP_OG_IMAGE || "/og-image.png";
  const buttonTitle = process.env.NEXT_PUBLIC_APP_TAGLINE || "Open App";

  const miniAppEmbed = JSON.stringify({
    version: "1",
    imageUrl,
    button: {
      title: buttonTitle.slice(0, 32),
      action: { url: appUrl || "/" },
    },
  });

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Farcaster Mini App Embed */}
        <meta property="fc:miniapp" content={miniAppEmbed} />
        {/* Backward-compatible frames tag */}
        <meta property="fc:frame" content={miniAppEmbed} />
        {/* Quick Auth performance hint */}
        <link rel="preconnect" href="https://auth.farcaster.xyz" />
      </head>
      <body>
        <MiniAppReady />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
