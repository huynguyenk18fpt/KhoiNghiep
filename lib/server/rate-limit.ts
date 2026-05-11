import { NextRequest, NextResponse } from "next/server";

type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

const buckets = new Map<string, Bucket>();

function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || req.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(req: NextRequest, namespace: string, options: RateLimitOptions) {
  const now = Date.now();
  const key = `${namespace}:${getClientIp(req)}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { limited: false, remaining: options.limit - 1, resetAt: now + options.windowMs };
  }

  if (bucket.count >= options.limit) {
    return { limited: true, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { limited: false, remaining: options.limit - bucket.count, resetAt: bucket.resetAt };
}

export function rateLimitResponse(resetAt: number) {
  const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return NextResponse.json(
    {
      error: "Bạn đang gửi yêu cầu hơi nhanh. Vui lòng thử lại sau ít phút để Floaty bảo vệ quota AI.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
      },
    },
  );
}
