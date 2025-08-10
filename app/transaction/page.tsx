"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMiniKit, useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import { SendTokenButton } from "../components/SendTokenButton";
import { ArrowLeft, User, Nfc, Wallet } from "lucide-react";

const BASE_CHAIN_ID = 8453; // Base mainnet by default for CAIP-19 examples

export default function TransactionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { isInMiniApp } = useIsInMiniApp();

  // Parse inputs from URL and memoize
  const { address, amount, name, mode } = useMemo(() => {
    const addr = searchParams.get("address") || "";
    const amt = searchParams.get("amount") || "";
    const nm = decodeURIComponent(searchParams.get("name") || "");
    const modeParam = searchParams.get("mode");
    const md =
      modeParam === "contact" || modeParam === "nfc" || modeParam === "manual"
        ? modeParam
        : "manual";
    return {
      address: addr,
      amount: amt,
      name: nm,
      mode: md as "contact" | "nfc" | "manual",
    };
  }, [searchParams]);

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  const getHeaderInfo = () => {
    switch (mode) {
      case "contact":
        return {
          icon: <User className="w-6 h-6 text-blue-600" />,
          title: name ? `Pay ${name}` : "Pay Contact",
          subtitle: "From your contacts",
        };
      case "nfc":
        return {
          icon: <Nfc className="w-6 h-6 text-green-600" />,
          title: "NFC Payment",
          subtitle: name ? `Pay ${name}` : "Tap to pay detected",
        };
      default:
        return {
          icon: <Wallet className="w-6 h-6 text-purple-600" />,
          title: "Send Payment",
          subtitle: "Manual transaction",
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="max-w-md mx-auto flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            {headerInfo.icon}
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {headerInfo.title}
              </h1>
              <p className="text-sm text-gray-600">{headerInfo.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Send Button */}
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Info card */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
          <p className="mb-1">
            This opens the native send sheet inside Warpcast with your defaults.
          </p>
          <p className="text-gray-500">Button is disabled outside Warpcast.</p>
        </div>

        <SendTokenButton
          token={`eip155:${BASE_CHAIN_ID}/native`}
          amount={amount ? amount : undefined}
          recipientAddress={address || undefined}
        >
          Send Token
        </SendTokenButton>

        {/* Optional: show the parsed context */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700">
          <div>In Mini App: {isInMiniApp ? "Yes" : "No"}</div>
          <div>Recipient: {address || "(none)"}</div>
          <div>Amount: {amount || "(none)"}</div>
          <div>Mode: {mode}</div>
          {name && <div>Name: {name}</div>}
        </div>
      </div>
    </div>
  );
}
