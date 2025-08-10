import sdk from "@farcaster/miniapp-sdk";
import { getUserNotificationDetails } from "@/lib/notification";
import { type SendNotificationRequest, sendNotificationResponseSchema } from "@farcaster/miniapp-sdk";

const appUrl = process.env.NEXT_PUBLIC_URL || "";

type SendFrameNotificationResult =
  | { state: "error"; error: unknown }
  | { state: "no_token" }
  | { state: "rate_limit" }
  | { state: "success" };

export async function sendFrameNotification({
  fid,
  title,
  body,
  notificationDetails,
}: {
  fid: number;
  title: string;
  body: string;
  notificationDetails?: { url: string; token: string } | null;
}): Promise<SendFrameNotificationResult> {
  // Try to use passed-in details first
  if (!notificationDetails) {
    // Fallback: pull from sdk context if available
    const ctx = sdk.context.client;
    notificationDetails = ctx.notificationDetails ?? (await getUserNotificationDetails(fid));
  }

  if (!notificationDetails) {
    return { state: "no_token" };
  }

  const response = await fetch(notificationDetails.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      notificationId: crypto.randomUUID(),
      title,
      body,
      targetUrl: appUrl,
      tokens: [notificationDetails.token],
    } satisfies SendNotificationRequest),
  });

  const responseJson = await response.json();

  if (response.status === 200) {
    const parsed = sendNotificationResponseSchema.safeParse(responseJson);
    if (parsed.success === false) {
      return { state: "error", error: parsed.error.errors };
    }

    if (parsed.data.result.rateLimitedTokens.length > 0) {
      return { state: "rate_limit" };
    }

    return { state: "success" };
  }

  return { state: "error", error: responseJson };
}

