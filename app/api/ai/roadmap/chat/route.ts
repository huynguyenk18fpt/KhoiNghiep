import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { structured, history, userMessage } = (await req.json()) as {
      structured: any;
      history: { role: "user" | "assistant"; content: string }[];
      userMessage: string;
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const system = `
Bạn là trợ lý huấn luyện bơi ưu tiên an toàn. Trả lời dựa vào "structured" (kế hoạch đã tạo) + câu hỏi.
- Ngắn gọn, thực tế, có số liệu (mét, phút, hiệp).
- Nếu vượt chuyên môn y tế, khuyên hỏi bác sĩ/HLV trực tiếp.
- Không đưa lời khuyên nguy hiểm.
`.trim();

    const historyText = history?.map(m => `${m.role === "user" ? "USER" : "ASSISTANT"}: ${m.content}`).join("\n") || "(empty)";

    const prompt = `
SYSTEM:
${system}

CURRENT PLAN (structured JSON):
${JSON.stringify(structured)}

DIALOG HISTORY:
${historyText}

USER:
${userMessage}

ASSISTANT:
- Trả lời bằng markdown có bullet, rõ ràng.
- Nếu liên quan bệnh nền trong structured, điều chỉnh cường độ phù hợp.
`.trim();

    const out = await model.generateContent(prompt);
    const text =
      typeof out?.response?.text === "function" ? out.response.text() : out?.response?.text || "";

    return NextResponse.json({ message: String(text).trim() });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message || "chat error" }, { status: 500 });
  }
}
