import { GoogleGenerativeAI } from "@google/generative-ai";

export function getModelPriority(): string[] {
  const envList = process.env.GEMINI_MODELS?.split(",")
    .map((model) => model.trim())
    .filter(Boolean);
  if (envList?.length) return envList;
  return ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"];
}

type RetryOpts = {
  maxRetries?: number;
  initialDelayMs?: number;
  multiplier?: number;
  maxDelayMs?: number;
};

const DEFAULT_RETRY: Required<RetryOpts> = {
  maxRetries: 3,
  initialDelayMs: 600,
  multiplier: 2,
  maxDelayMs: 5000,
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorStatus(err: unknown) {
  if (typeof err !== "object" || err === null) return undefined;
  const normalized = err as { status?: number; response?: { status?: number } };
  return normalized.status ?? normalized.response?.status;
}

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    return String((err as { message?: unknown }).message);
  }
  return "";
}

export async function callGeminiWithRetry(
  apiKey: string,
  prompt: string,
  retryOpts: RetryOpts = {},
): Promise<string> {
  const opts = { ...DEFAULT_RETRY, ...retryOpts };
  const models = getModelPriority();
  const genAI = new GoogleGenerativeAI(apiKey);

  let lastErr: unknown = null;

  for (const modelId of models) {
    const model = genAI.getGenerativeModel({ model: modelId });
    let delay = opts.initialDelayMs;

    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const raw = typeof result.response.text === "function" ? result.response.text() : result.response.text;
        const text = String(raw || "").trim();
        if (!text) throw new Error("Empty response from Gemini");
        return text;
      } catch (err) {
        lastErr = err;
        const status = getErrorStatus(err);
        const isTransient = status === 429 || status === 503 || status === 500;
        const isLastAttempt = attempt === opts.maxRetries;
        if (!isTransient || isLastAttempt) break;

        const jitter = Math.floor(Math.random() * 200);
        const wait = Math.min(delay + jitter, opts.maxDelayMs);
        await sleep(wait);
        delay = Math.min(delay * opts.multiplier, opts.maxDelayMs);
      }
    }
  }

  const msg =
    getErrorMessage(lastErr) ||
    `[Gemini Error] Không thể tạo nội dung sau khi thử nhiều model (${getModelPriority().join(" -> ")})`;
  const status = getErrorStatus(lastErr) ?? "unknown";
  throw new Error(`${msg} (status: ${status})`);
}

export function extractJson(text: string): unknown {
  const jsonStr = text
    .replace(/^```json/gi, "")
    .replace(/^```/gi, "")
    .replace(/```$/gi, "")
    .trim();
  try {
    return JSON.parse(jsonStr) as unknown;
  } catch {
    return null;
  }
}
