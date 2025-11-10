// app/api/ai/roadmap/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callGeminiWithRetry, extractJson } from "@/lib/ai/gemini";

export const runtime = "nodejs";

type HealthStatus = {
  heartDisease: boolean;
  asthma: boolean;
  jointProblems: boolean;
  highBloodPressure: boolean;
  other: boolean;
  otherDetails?: string;
};

type FormData = {
  age: string;
  height: string;
  weight: string;
  skillLevel: "beginner" | "intermediate" | "advanced" | "";
  goal: "swimmingForHealth" | "rescueSkills" | "sportsSwimming" | "";
  frequency: "2timesWeek" | "3timesWeek" | "4timesWeek" | "";
  healthStatus: HealthStatus;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { formData: FormData };
    const { formData } = body;

    const age = parseInt(formData.age);
    const height = parseInt(formData.height);
    const weight = parseInt(formData.weight);

    if (Number.isNaN(age) || age < 6) {
      return NextResponse.json({ error: "Tuổi tối thiểu là 6." }, { status: 400 });
    }
    if (Number.isNaN(height) || height < 100) {
      return NextResponse.json({ error: "Chiều cao tối thiểu là 100cm." }, { status: 400 });
    }
    if (Number.isNaN(weight) || weight < 20) {
      return NextResponse.json({ error: "Cân nặng tối thiểu là 20kg." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Thiếu GEMINI_API_KEY" }, { status: 500 });
    }

    const goalMap: Record<FormData["goal"], string> = {
      swimmingForHealth: "Học bơi để nâng cao sức khỏe",
      rescueSkills: "Học cứu hộ và phòng chống đuối nước",
      sportsSwimming: "Học bơi thể thao",
      "": "Không chọn",
    };

    const freqMap: Record<FormData["frequency"], string> = {
      "2timesWeek": "2 buổi/tuần",
      "3timesWeek": "3 buổi/tuần",
      "4timesWeek": "4 buổi/tuần",
      "": "Không chọn",
    };

    const sessionsMap: Record<FormData["frequency"], number> = {
      "2timesWeek": 2,
      "3timesWeek": 3,
      "4timesWeek": 4,
      "": 3,
    };

    const safetyNotes = `
YÊU CẦU BẮT BUỘC VỀ AN TOÀN & HƯỚNG DẪN:
- Phù hợp độ tuổi ${age}, thể trạng ${weight}kg/${height}cm, trình độ ${formData.skillLevel || "chưa xác định"}.
- Bệnh nền: ${JSON.stringify(formData.healthStatus)} → 
  1) KHỞI ĐỘNG kỹ; 2) LUYỆN THỞ nhẹ;
  3) TRÁNH nín thở kéo dài/cường độ cao nếu tim-mạch/HA/hen/khớp;
  4) LUÔN có giám sát; 5) BẤT THƯỜNG thì dừng và hỏi bác sĩ.
- Không khuyến khích hành vi nguy hiểm (nhảy cao, nín thở cực hạn, bơi xa bờ, tự cứu hộ khi chưa đào tạo).
`.trim();

    const prompt = `
Bạn là HLV bơi + chuyên gia an toàn ở Việt Nam. Hãy tạo **lộ trình 8 tuần chi tiết** và đoạn chat mở đầu thân thiện.

INPUT:
- Tuổi: ${age}
- Cao/Nặng: ${height}cm / ${weight}kg
- Trình độ: ${formData.skillLevel || "chưa chọn"}
- Mục tiêu: ${goalMap[formData.goal]}
- Tần suất: ${freqMap[formData.frequency]}
- SessionsPerWeek: ${sessionsMap[formData.frequency]}
- Tiền sử: ${JSON.stringify(formData.healthStatus)}

${safetyNotes}

YÊU CẦU ĐẦU RA (JSON duy nhất, không kèm giải thích):
{
  "message": "markdown mở đầu (2–5 đoạn ngắn, tích cực, nhấn mạnh an toàn)",
  "structured": {
    "title": "ngắn gọn, ví dụ: 'Lộ trình an toàn cho bé X tuổi (có hen suyễn)'",
    "weeklyPlan": [
      {
        "week": 1,
        "sessionsPerWeek": ${sessionsMap[formData.frequency]},
        "pool": [
          {"name":"Làm quen nước & thở","durationMin":25,"drills":["thở ra dưới nước 3×10","trượt nước 6–8 lần"]},
          {"name":"Nổi sấp/ngửa hỗ trợ","durationMin":20,"drills":["nổi sao biển 3×20s","đổi tư thế sấp-ngửa"]}
        ],
        "dry": ["xoay khớp toàn thân 5’","bài core nhẹ 3×20s"],
        "checkpoints": ["giữ nổi 20–30s","thổi bong bóng dưới nước"],
        "notesForConditions": ["giảm nhịp nếu có hen/HA cao"]
      },
      { "week": 2, "...": "tương tự" },
      { "week": 3, "...": "tương tự" },
      { "week": 4, "...": "tương tự" },
      { "week": 5, "...": "tương tự, thêm tự cứu" },
      { "week": 6, "...": "tương tự, thêm cứu hộ từ xa" },
      { "week": 7, "...": "tương tự, mô phỏng tình huống" },
      { "week": 8, "...": "tổng hợp + kiểm tra nhẹ" }
    ],
    "safety": ["mẹo an toàn 1","mẹo an toàn 2"],
    "dryExercises": ["bài khô nền tảng"],
    "goalNotes": ["gợi ý theo mục tiêu ${goalMap[formData.goal]} và tần suất ${freqMap[formData.frequency]}"]
  }
}
- Không đưa lời khuyên nguy hiểm.
`.trim();

    const text = await callGeminiWithRetry(apiKey, prompt, {
      maxRetries: 3,
      initialDelayMs: 700,
      multiplier: 2,
      maxDelayMs: 6000,
    });

    const json = extractJson(text) ?? { message: text, structured: null };
    return NextResponse.json(json);
  } catch (err: any) {
    console.error("AI roadmap error:", err);
    return NextResponse.json(
      {
        error:
          err?.message ||
          "AI error: không thể tạo lộ trình (đã thử retry và fallback model).",
      },
      { status: 502 },
    );
  }
}
