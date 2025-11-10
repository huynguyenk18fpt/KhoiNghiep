import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
    const freqToSessions: Record<FormData["frequency"], number> = {
      "2timesWeek": 2,
      "3timesWeek": 3,
      "4timesWeek": 4,
      "": 3,
    };

    const safetyNotes = `
YÊU CẦU BẮT BUỘC VỀ AN TOÀN & HƯỚNG DẪN:
- Phù hợp độ tuổi ${age}, thể trạng ${weight}kg/${height}cm, trình độ ${formData.skillLevel || "chưa xác định"}.
- Bệnh nền: ${JSON.stringify(formData.healthStatus)} → 
  1) KHỞI ĐỘNG kỹ; 2) LUYỆN THỞ nhẹ nhàng; 
  3) TRÁNH nín thở kéo dài/cường độ cao nếu tim-mạch/HA/hen/khớp; 
  4) LUÔN có giám sát; 5) BẤT THƯỜNG là dừng và hỏi bác sĩ.
- Không khuyến khích hành vi nguy hiểm (nhảy cao, nín thở cực hạn, bơi xa bờ, tự cứu hộ khi chưa đào tạo).
`.trim();

    const prompt = `
Bạn là huấn luyện viên bơi + chuyên gia an toàn bể bơi ở VN. Hãy tạo **lộ trình 8 tuần chi tiết** và chat mở đầu thân thiện.

INPUT:
- Tuổi: ${age}
- Cao/Nặng: ${height}cm / ${weight}kg
- Trình độ: ${formData.skillLevel || "chưa chọn"}
- Mục tiêu: ${goalMap[formData.goal]}
- Tần suất: ${freqMap[formData.frequency]}
- SessionsPerWeek: ${freqToSessions[formData.frequency]}
- Tiền sử: ${JSON.stringify(formData.healthStatus)}

${safetyNotes}

YÊU CẦU ĐẦU RA (JSON duy nhất, không kèm giải thích):
{
  "message": "markdown mở đầu (2–5 đoạn ngắn, giọng tích cực, nhấn mạnh an toàn)",
  "structured": {
    "title": "ngắn gọn, ví dụ: 'Lộ trình an toàn cho bé X tuổi (có hen suyễn)'",
    "weeklyPlan": [
      {
        "week": 1,
        "sessionsPerWeek": ${freqToSessions[formData.frequency]},
        "pool": [
          {"name":"Bài cụ thể 1","durationMin":30,"drills":["động tác A 3×10","..."]},
          {"name":"Bài cụ thể 2","durationMin":30,"drills":["..."]}
        ],
        "dry": ["bài khô 1","bài khô 2"],
        "checkpoints": ["tiêu chí hoàn thành tuần 1"],
        "notesForConditions": ["lưu ý theo bệnh nền nếu có"]
      },
      { "week": 2, "...": "tương tự, giữ số buổi/tuần phù hợp" },
      ...
      { "week": 8, "...": "tương tự, có bài kiểm tra nhẹ cuối lộ trình" }
    ],
    "safety": ["không bơi một mình","có thiết bị nổi gần","quan sát biển cảnh báo","dừng khi chóng mặt/khó thở"],
    "dryExercises": ["hít–thở cơ hoành 5–10’/ngày","giãn cơ vai–ngực–lưng sau buổi bơi"],
    "goalNotes": ["điều chỉnh theo mục tiêu ${goalMap[formData.goal]} và tần suất ${freqMap[formData.frequency]}"]
  }
}

QUY TẮC:
- Có đủ 8 tuần, dữ liệu cụ thể (phút, số hiệp, mét nếu hợp lý).
- "notesForConditions" phải phản ánh đúng bệnh nền trong INPUT.
- Không đưa lời khuyên nguy hiểm.
`.trim();

    const ai = await model.generateContent(prompt);
    const raw =
      typeof ai?.response?.text === "function" ? ai.response.text() : ai?.response?.text;
    const txt = String(raw || "").trim();

    let json: any = null;
    try {
      const jsonStr = txt
        .replace(/^```json/gi, "")
        .replace(/^```/gi, "")
        .replace(/```$/gi, "")
        .trim();
      json = JSON.parse(jsonStr);
    } catch {
      json = { message: txt, structured: null };
    }

    return NextResponse.json(json);
  } catch (err: any) {
    console.error("AI roadmap error:", err);
    return NextResponse.json({ error: err?.message || "AI error" }, { status: 500 });
  }
}
