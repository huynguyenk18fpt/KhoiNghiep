import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callGeminiWithRetry } from "@/lib/ai/gemini";
import { checkRateLimit, rateLimitResponse } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

const chatRequestSchema = z.object({
  structured: z.unknown().nullable(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "ai"]),
        content: z.string().max(2000),
      }),
    )
    .default([]),
  userMessage: z.string().min(1).max(1200),
});

function isGeminiApiKeyError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("API_KEY_INVALID") ||
    message.includes("API Key not found") ||
    message.includes("API key not valid")
  );
}

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, "ai-roadmap-chat", { limit: 20, windowMs: 10 * 60 * 1000 });
    if (rateLimit.limited) {
      return rateLimitResponse(rateLimit.resetAt);
    }

    const parsed = chatRequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Dữ liệu chat không hợp lệ." }, { status: 400 });
    }

    const { structured, history, userMessage } = parsed.data;
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({
        message:
          "Hiện chưa cấu hình GEMINI_API_KEY nên mình không thể trả lời bằng AI. Bạn vẫn nên giữ nguyên nguyên tắc an toàn: tập có giám sát, nghỉ khi khó thở/chóng mặt và hỏi HLV trực tiếp nếu có bệnh nền.",
      });
    }

    const system = `
Bạn là trợ lý huấn luyện bơi ưu tiên an toàn. Trả lời dựa trên kế hoạch structured và câu hỏi của người dùng.
- Ngắn gọn, thực tế, có số liệu như mét, phút, hiệp nếu phù hợp.
- Nếu liên quan y tế hoặc bệnh nền, khuyên hỏi bác sĩ/HLV trực tiếp.
- Không đưa lời khuyên nguy hiểm.
`.trim();

    const historyText =
      history.map((message) => `${message.role === "user" ? "USER" : "ASSISTANT"}: ${message.content}`).join("\n") ||
      "(empty)";

    const prompt = `
SYSTEM:
${system}

CURRENT PLAN:
${JSON.stringify(structured)}

DIALOG HISTORY:
${historyText}

USER:
${userMessage}

ASSISTANT:
Trả lời bằng markdown rõ ràng.
`.trim();

    let text: string;
    try {
      text = await callGeminiWithRetry(apiKey, prompt, {
        maxRetries: 3,
        initialDelayMs: 700,
        multiplier: 2,
        maxDelayMs: 6000,
      });
    } catch (err) {
      if (isGeminiApiKeyError(err)) {
        return NextResponse.json({
          message:
            "GEMINI_API_KEY hiện không hợp lệ hoặc chưa bật Generative Language API, nên mình chưa thể trả lời bằng AI. Bạn vẫn nên giữ nguyên nguyên tắc an toàn: tập có giám sát, nghỉ khi khó thở/chóng mặt và hỏi HLV trực tiếp nếu có bệnh nền.",
        });
      }
      throw err;
    }

    return NextResponse.json({ message: text.trim() });
  } catch (err) {
    console.error("roadmap/chat error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Không thể trả lời chat AI." }, { status: 502 });
  }
}
