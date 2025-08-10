"use client";

import { useSendToken, useIsInMiniApp } from "@coinbase/onchainkit/minikit";

interface SendTokenButtonProps {
  token: string; // CAIP-19, e.g. eip155:8453/native or eip155:8453/erc20:0x...
  amount?: string; // string with decimals included
  recipientAddress?: string;
  recipientFid?: number;
  className?: string;
  children?: React.ReactNode;
}

export function SendTokenButton({
  token,
  amount,
  recipientAddress,
  recipientFid,
  className,
  children,
}: SendTokenButtonProps) {
  const { isInMiniApp } = useIsInMiniApp();
  const { sendToken } = useSendToken();

  return (
    <button
      disabled={!isInMiniApp}
      className={
        className ??
        "w-full p-4 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:text-gray-600"
      }
      onClick={() => {
        sendToken({
          token,
          ...(amount ? { amount } : {}),
          ...(recipientAddress ? { recipientAddress } : {}),
          ...(recipientFid ? { recipientFid } : {}),
        });
      }}
    >
      {children ?? "Send Token"}
    </button>
  );
}
