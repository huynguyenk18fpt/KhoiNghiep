import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callGeminiWithRetry, extractJson } from "@/lib/ai/gemini";
import { checkRateLimit, rateLimitResponse } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

const healthStatusSchema = z.object({
  heartDisease: z.boolean(),
  asthma: z.boolean(),
  jointProblems: z.boolean(),
  highBloodPressure: z.boolean(),
  other: z.boolean(),
  otherDetails: z.string().optional(),
});

const roadmapRequestSchema = z.object({
  formData: z.object({
    age: z.string(),
    height: z.string(),
    weight: z.string(),
    skillLevel: z.enum(["beginner", "intermediate", "advanced", ""]),
    goal: z.enum(["swimmingForHealth", "rescueSkills", "sportsSwimming", ""]),
    frequency: z.enum(["2timesWeek", "3timesWeek", "4timesWeek", ""]),
    healthStatus: healthStatusSchema,
  }),
});

type RoadmapFormData = z.infer<typeof roadmapRequestSchema>["formData"];

function isRoadmapAIResponse(value: unknown): value is { message: string; structured: unknown } {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    "structured" in value &&
    typeof (value as { message?: unknown }).message === "string"
  );
}

function isGeminiApiKeyError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("API_KEY_INVALID") ||
    message.includes("API Key not found") ||
    message.includes("API key not valid")
  );
}

function buildFallbackPlan(formData: RoadmapFormData, reason: string) {
  const sessionsPerWeek =
    formData.frequency === "2timesWeek" ? 2 : formData.frequency === "4timesWeek" ? 4 : 3;
  const age = Number.parseInt(formData.age, 10);

  return {
    source: "fallback",
    message: `Mình đang dùng lộ trình mẫu vì ${reason}. Bạn vẫn có thể tham khảo kế hoạch 8 tuần an toàn này và điều chỉnh với huấn luyện viên trực tiếp khi cần.`,
    structured: {
      title: `Lộ trình học bơi an toàn cho học viên ${Number.isNaN(age) ? "" : `${age} tuổi`}`.trim(),
      weeklyPlan: Array.from({ length: 8 }, (_, index) => {
        const week = index + 1;
        return {
          week,
          sessionsPerWeek,
          pool: [
            {
              name: week <= 2 ? "Làm quen nước và kiểm soát thở" : "Kỹ thuật bơi cơ bản",
              durationMin: week <= 2 ? 25 : 35,
              drills:
                week <= 2
                  ? ["thổi bong bóng dưới nước 3 x 10 lần", "nổi ngửa có hỗ trợ 3 x 20 giây"]
                  : ["đạp chân với phao 6 x 15m", "phối hợp tay chân nhẹ 4 x 15m"],
            },
            {
              name: week >= 5 ? "Kỹ năng an toàn và tự cứu" : "Nổi và di chuyển ngắn",
              durationMin: week >= 5 ? 25 : 20,
              drills:
                week >= 5
                  ? ["bám thành nghỉ thở", "ném phao hỗ trợ từ bờ, không lao xuống cứu trực tiếp"]
                  : ["trượt nước 6 lần", "đổi tư thế sấp-ngửa có giám sát"],
            },
          ],
          dry: ["xoay khớp 5 phút", "bài core nhẹ 3 x 20 giây"],
          checkpoints: ["giữ bình tĩnh khi xuống nước", "dừng tập nếu khó thở, đau ngực hoặc chóng mặt"],
          notesForConditions: formData.healthStatus.asthma
            ? ["Giảm cường độ, nghỉ nhiều hơn và chuẩn bị thuốc theo chỉ định bác sĩ nếu có hen."]
            : ["Luôn tập với người giám sát và tránh nín thở kéo dài."],
        };
      }),
      safety: [
        "Luôn khởi động trước khi xuống nước.",
        "Không bơi một mình hoặc bơi xa bờ khi chưa được đào tạo.",
        "Không nín thở kéo dài hoặc thi chịu đựng dưới nước.",
      ],
      dryExercises: ["xoay vai", "gập duỗi cổ chân", "plank nhẹ", "tập thở chậm"],
      goalNotes: ["Đây là lộ trình mẫu FE-only khi AI chưa sẵn sàng hoặc thiếu khóa API."],
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, "ai-roadmap", { limit: 5, windowMs: 10 * 60 * 1000 });
    if (rateLimit.limited) {
      return rateLimitResponse(rateLimit.resetAt);
    }

    const parsed = roadmapRequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Dữ liệu lộ trình không hợp lệ." }, { status: 400 });
    }

    const { formData } = parsed.data;
    const age = Number.parseInt(formData.age, 10);
    const height = Number.parseInt(formData.height, 10);
    const weight = Number.parseInt(formData.weight, 10);

    if (Number.isNaN(age) || age < 6) {
      return NextResponse.json({ error: "Tuổi tối thiểu là 6." }, { status: 400 });
    }
    if (Number.isNaN(height) || height < 100) {
      return NextResponse.json({ error: "Chiều cao tối thiểu là 100cm." }, { status: 400 });
    }
    if (Number.isNaN(weight) || weight < 20) {
      return NextResponse.json({ error: "Cân nặng tối thiểu là 20kg." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(buildFallbackPlan(formData, "chưa cấu hình GEMINI_API_KEY"));
    }

    const goalMap: Record<RoadmapFormData["goal"], string> = {
      swimmingForHealth: "học bơi để nâng cao sức khỏe",
      rescueSkills: "học kỹ năng cứu hộ và phòng chống đuối nước",
      sportsSwimming: "học bơi thể thao",
      "": "chưa chọn mục tiêu",
    };

    const freqMap: Record<RoadmapFormData["frequency"], string> = {
      "2timesWeek": "2 buổi/tuần",
      "3timesWeek": "3 buổi/tuần",
      "4timesWeek": "4 buổi/tuần",
      "": "chưa chọn tần suất",
    };

    const sessionsMap: Record<RoadmapFormData["frequency"], number> = {
      "2timesWeek": 2,
      "3timesWeek": 3,
      "4timesWeek": 4,
      "": 3,
    };

    const prompt = `
Bạn là huấn luyện viên bơi và chuyên gia an toàn dưới nước tại Việt Nam. Hãy tạo lộ trình 8 tuần chi tiết, ưu tiên an toàn.

INPUT:
- Tuổi: ${age}
- Cao/nặng: ${height}cm / ${weight}kg
- Trình độ: ${formData.skillLevel || "chưa chọn"}
- Mục tiêu: ${goalMap[formData.goal]}
- Tần suất: ${freqMap[formData.frequency]}
- SessionsPerWeek: ${sessionsMap[formData.frequency]}
- Tiền sử sức khỏe: ${JSON.stringify(formData.healthStatus)}

YÊU CẦU AN TOÀN:
- Phù hợp độ tuổi, thể trạng và trình độ.
- Luôn có giám sát trực tiếp.
- Tránh nín thở kéo dài, bơi xa bờ, nhảy từ cao, hoặc tự lao xuống cứu người khi chưa được đào tạo.
- Nếu có bệnh nền tim mạch, huyết áp, hen hoặc khớp, giảm cường độ và khuyên hỏi bác sĩ/HLV trực tiếp.

Chỉ trả về JSON hợp lệ, không kèm giải thích:
{
  "message": "markdown mở đầu 2-5 đoạn ngắn",
  "structured": {
    "title": "tiêu đề ngắn",
    "weeklyPlan": [
      {
        "week": 1,
        "sessionsPerWeek": ${sessionsMap[formData.frequency]},
        "pool": [
          {"name":"Làm quen nước và thở","durationMin":25,"drills":["thở ra dưới nước 3 x 10","trượt nước 6-8 lần"]}
        ],
        "dry": ["xoay khớp toàn thân 5 phút"],
        "checkpoints": ["giữ nổi 20-30 giây"],
        "notesForConditions": ["giảm nhịp nếu có bệnh nền"]
      }
    ],
    "safety": ["mẹo an toàn"],
    "dryExercises": ["bài tập khô"],
    "goalNotes": ["gợi ý theo mục tiêu"]
  }
}
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
        return NextResponse.json(
          buildFallbackPlan(formData, "GEMINI_API_KEY không hợp lệ hoặc chưa bật Generative Language API"),
        );
      }
      throw err;
    }

    const json = extractJson(text);
    if (!isRoadmapAIResponse(json) || !json.structured) {
      return NextResponse.json(buildFallbackPlan(formData, "AI trả về dữ liệu chưa đúng định dạng"));
    }

    return NextResponse.json({ ...json, source: "ai" });
  } catch (err) {
    console.error("AI roadmap error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Không thể tạo lộ trình AI." }, { status: 502 });
  }
}
