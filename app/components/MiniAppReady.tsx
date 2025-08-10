"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export function MiniAppReady() {
  useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        await sdk.actions.ready();
      } catch (_err) {
        // Swallow errors if not running inside a Farcaster Mini App
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, []);

  return null;
}
