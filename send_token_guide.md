### Goal
Add a “Send Token” action to your mini app using OnchainKit MiniKit, so users can open a native send flow with token, amount, and recipient pre-filled.

### What you’ll build
- A button that opens the MiniKit send sheet (inside Warpcast) with your defaults
- Proper provider setup so the MiniKit hooks work
- Optional: inputs for FID or address, success/error handling

---

### Prerequisites
- Next.js/React app
- OnchainKit API key
- Warpcast mini app context (the send sheet opens inside Warpcast; outside it, you should disable the button)

---

### 1) Install dependencies
Use your package manager to install OnchainKit and peers.

```bash
# with pnpm
pnpm add @coinbase/onchainkit @farcaster/frame-sdk wagmi viem @tanstack/react-query
```

Notes:
- `@farcaster/frame-sdk` is required by MiniKit actions.
- If you don’t already have them, ensure `react`, `react-dom`, `next` are installed.

---

### 2) Configure environment variables
Create `.env.local` (or use your own env system) and set:

```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=YOUR_ONCHAINKIT_API_KEY
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=Your App Name
NEXT_PUBLIC_ICON_URL=https://your.cdn/logo.png
```

Tip: The example repo includes `.env.example` you can mirror.

---

### 3) Wrap your app in `MiniKitProvider`
Add a global provider with your chain and branding. For Base chain:

```tsx
// app/providers.tsx
"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";

export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
        wallet: {
          preference: "all",
        },
      }}
    >
      {props.children}
    </MiniKitProvider>
  );
}
```

Then include it in your root layout:

```tsx
// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

Reference from the example:

```startLine:1:endLine:26:/home/aaddy/Desktop/Aaddy_Codes/ETHVietnam/onchainkit/examples/minikit-example/app/providers.tsx
"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";

export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
        wallet: {
          preference: "all",
        },
      }}
    >
      {props.children}
    </MiniKitProvider>
  );
}
```

---

### 4) Create a Send Token button
Use the MiniKit hook `useSendToken` and gate it to Warpcast via `useIsInMiniApp`.

```tsx
// components/SendTokenButton.tsx
"use client";

import { useSendToken, useIsInMiniApp } from "@coinbase/onchainkit/minikit";

export function SendTokenButton() {
  const { isInMiniApp } = useIsInMiniApp();
  const { sendToken } = useSendToken();

  return (
    <button
      disabled={!isInMiniApp}
      onClick={() => {
        sendToken({
          token: "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base USDC
          amount: "1000000", // 1.000000 USDC (6 decimals)
          recipientAddress: "0xYourRecipientAddressHere",
        });
      }}
    >
      Send Token
    </button>
  );
}
```

You can drop this anywhere in your page:

```tsx
// app/page.tsx
import { SendTokenButton } from "../components/SendTokenButton";

export default function Page() {
  return (
    <main>
      <SendTokenButton />
    </main>
  );
}
```

Reference from the example:

```startLine:1:endLine:23:/home/aaddy/Desktop/Aaddy_Codes/ETHVietnam/onchainkit/examples/minikit-example/app/actions/SendToken.tsx
"use client";
import { useSendToken, useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import { Button } from "../ui/Button";

export function SendToken() {
  const { isInMiniApp } = useIsInMiniApp();
  const { sendToken } = useSendToken();

  return (
    <Button
      disabled={!isInMiniApp}
      onClick={() => {
        sendToken({
          token: "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base USDC
          amount: "1000000", // 1 USDC (6 decimals)
          recipientAddress: "0xfa6b3dF826636Eb76E23C1Ee38180dB3b8f60a86", // Example recipient address
        });
      }}
    >
      Send Token
    </Button>
  );
}
```

---

### 5) API: `useSendToken` params
- **token**: CAIP-19 asset ID for the token (e.g., Base USDC: `eip155:8453/erc20:0x833589f...`). Use `eip155:<chainId>/native` for native ETH (e.g., Base ETH: `eip155:8453/native`).
- **amount**: String of the amount including token decimals (e.g., USDC 1.23 → `"1230000"`).
- **recipientAddress**: EVM address.
- **recipientFid**: Farcaster FID (alternative to address).

You can allow either FID or address:

```tsx
sendToken({
  token: "eip155:8453/native", // Base ETH
  amount: "1000000000000000", // 0.001 ETH in wei (prefill)
  recipientFid: 602, // will resolve to the user's address
});
```

What happens:
- The MiniKit send sheet opens with your defaults pre-filled.
- The user can modify the token, amount, and recipient before submitting.

Advanced: await result

```tsx
const { sendTokenAsync } = useSendToken();

const result = await sendTokenAsync({
  token: "eip155:8453/erc20:0x833589f...",
  amount: "2500000",
  recipientAddress: "0xabc...",
});
// Use result to update UI or logs
```

---

### 6) Detect mini app environment and mark frame ready
In your page, it’s good practice to mark the frame as ready so the host can display correctly:

```tsx
"use client";
import { useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

export default function Page() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  return <div>...</div>;
}
```

From the example usage:

```startLine:27:endLine:37:/home/aaddy/Desktop/Aaddy_Codes/ETHVietnam/onchainkit/examples/minikit-example/app/page.tsx
export default function App() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);
```

---

### 7) Choosing token IDs (CAIP-19)
- ERC-20 on Base: `eip155:8453/erc20:<tokenAddress>`
- Native: `eip155:8453/native`
- Replace `8453` with your chain ID as needed.

Examples:
- Base USDC: `eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Base ETH: `eip155:8453/native`

---

### 8) UX and validation tips
- Disable the button outside Warpcast: `const { isInMiniApp } = useIsInMiniApp();`
- For `amount`, prefill carefully; or omit to let the user input.
- Use `sendTokenAsync` if you need to react after the sheet completes or errors.

---

### 9) Troubleshooting
- Button disabled: ensure you’re inside Warpcast; the send sheet won’t open on a normal browser page.
- Nothing happens: confirm `MiniKitProvider` is wrapping your app and `setFrameReady()` is called on mount.
- API key errors: verify `NEXT_PUBLIC_ONCHAINKIT_API_KEY` is set and your app has restarted.
- Wrong token: double-check your CAIP-19 string and chain ID.

---

### References
- MiniKit hook (internals use Farcaster Frame SDK `sdk.actions.sendToken` to open the send sheet):
```startLine:49:endLine:63:/home/aaddy/Desktop/Aaddy_Codes/ETHVietnam/onchainkit/packages/onchainkit/src/minikit/hooks/useSendToken.ts
/**
 * Opens the send token form with the parameters pre-filled. The user will be able to modify the details before submitting the transaction.
 */
export function useSendToken(): SendTokenReturn {
  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationFn: async (params: SendTokenParams) => {
      return await sdk.actions.sendToken(params);
    },
  });

  return {
    ...rest,
    sendToken: mutate,
    sendTokenAsync: mutateAsync,
  };
}
```

- Example button component:
```startLine:1:endLine:23:/home/aaddy/Desktop/Aaddy_Codes/ETHVietnam/onchainkit/examples/minikit-example/app/actions/SendToken.tsx
"use client";
import { useSendToken, useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import { Button } from "../ui/Button";

export function SendToken() {
  const { isInMiniApp } = useIsInMiniApp();
  const { sendToken } = useSendToken();

  return (
    <Button
      disabled={!isInMiniApp}
      onClick={() => {
        sendToken({
          token: "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base USDC
          amount: "1000000", // 1 USDC (6 decimals)
          recipientAddress: "0xfa6b3dF826636Eb76E23C1Ee38180dB3b8f60a86", // Example recipient address
        });
      }}
    >
      Send Token
    </Button>
  );
}
```

- Provider wiring:
```startLine:1:endLine:26:/home/aaddy/Desktop/Aaddy_Codes/ETHVietnam/onchainkit/examples/minikit-example/app/providers.tsx
"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";

export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
        wallet: {
          preference: "all",
        },
      }}
    >
      {props.children}
    </MiniKitProvider>
  );
}
```

---

- MiniKit docs: [MiniKit Documentation](https://base.org/builders/minikit)
- OnchainKit docs: [OnchainKit Documentation](https://onchainkit.xyz)

- If you want to pre-build a raw ERC-20 transfer transaction yourself (not required for MiniKit’s send sheet), OnchainKit provides a helper:
```startLine:7:endLine:20:/home/aaddy/Desktop/Aaddy_Codes/ETHVietnam/onchainkit/packages/onchainkit/src/api/buildSendTransaction.ts
export function buildSendTransaction({
  recipientAddress,
  tokenAddress,
  amount,
}: BuildSendTransactionParams): BuildSendTransactionResponse {
  // if no token address, we are sending native ETH
  // and the data prop is empty
  if (!tokenAddress) {
    return {
      to: recipientAddress,
      data: '0x',
      value: amount,
    };
  }
```

—

- You’re done. Users can tap your button inside Warpcast to send tokens with your prefilled parameters.

- Changes you should make:
  - Add `MiniKitProvider` in `app/providers.tsx` and include it in `app/layout.tsx`
  - Create a `SendTokenButton` and place it in your page
  - Configure env vars for API key, app name, and logo 