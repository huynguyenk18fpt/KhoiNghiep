"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import RoadmapForm, { type RoadmapFormValue } from "@/components/roadmap/roadmap-form";
import ChatPanel from "@/components/roadmap/chat-panel";
import WeeklyTimeline from "@/components/roadmap/weekly-timeline";
import SafetyChecklist from "@/components/roadmap/safety-checklist";
import GoalNotes from "@/components/roadmap/goal-notes";

type ChatMsg = { role: "user" | "ai"; content: string };
type BuildStatus = "idle" | "generating" | "success" | "error";
type PlanSource = "ai" | "fallback";

type RoadmapPlan = {
  title?: string;
  weeklyPlan?: {
    week: number;
    sessionsPerWeek?: number;
    pool?: { name: string; durationMin?: number; drills?: string[] }[];
    dry?: string[];
    checkpoints?: string[];
    notesForConditions?: string[];
  }[];
  safety?: string[];
  dryExercises?: string[];
  goalNotes?: string[];
};

type AIResponse = {
  message?: string;
  structured?: RoadmapPlan | null;
  source?: PlanSource;
  error?: string;
};

const levelLabels: Record<RoadmapFormValue["level"], string> = {
  beginner: "Mới bắt đầu",
  intermediate: "Trung cấp",
  advanced: "Nâng cao",
};

const goalLabels: Record<RoadmapFormValue["goal"], string> = {
  "suc-khoe": "Sức khỏe",
  "cuu-ho": "Cứu hộ",
  "the-thao": "Thể thao",
};

const frequencyLabels: Record<RoadmapFormValue["frequency"], string> = {
  "2": "2 buổi/tuần",
  "3": "3 buổi/tuần",
  "4": "4 buổi/tuần",
};

function LoadingPlanCard() {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm" aria-live="polite" aria-busy="true">
      <div className="mb-4 h-5 w-40 animate-pulse rounded bg-muted" />
      <div className="mb-3 h-8 w-3/4 animate-pulse rounded bg-muted" />
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-muted" />
      <p className="mt-5 text-sm text-muted-foreground">
        Floaty đang tạo lộ trình an toàn theo thông tin bạn đã nhập. Timeline sẽ xuất hiện khi có kết quả.
      </p>
    </div>
  );
}

export default function RoadmapClient() {
  const [formData, setFormData] = useState<RoadmapFormValue | null>(null);
  const [plan, setPlan] = useState<RoadmapPlan | null>(null);
  const [heroTitle, setHeroTitle] = useState("");
  const [status, setStatus] = useState<BuildStatus>("idle");
  const [source, setSource] = useState<PlanSource | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const sessionsPerWeekNum = Number(formData?.frequency || 3);
  const hasPlan = status === "success" && Boolean(plan);

  const handleFormSubmit = async (data: RoadmapFormValue) => {
    setFormData(data);
    setStatus("generating");
    setSource(null);
    setLastError(null);
    setPlan(null);
    setHeroTitle("");

    const userSummary = `Tạo lộ trình học bơi cho học viên ${data.age} tuổi, ${data.height}cm/${data.weight}kg, trình độ ${
      levelLabels[data.level]
    }, mục tiêu ${goalLabels[data.goal]}, ${frequencyLabels[data.frequency]}${
      data.healthHistory.length ? `, tiền sử: ${data.healthHistory.join(", ")}` : ""
    }.`;

    setChatMessages([
      { role: "user", content: userSummary },
      { role: "ai", content: "Mình đang tạo lộ trình an toàn và phù hợp cho bạn..." },
    ]);

    try {
      const res = await fetch("/api/ai/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: {
            age: String(data.age),
            height: String(data.height),
            weight: String(data.weight),
            skillLevel: data.level,
            goal:
              data.goal === "suc-khoe"
                ? "swimmingForHealth"
                : data.goal === "cuu-ho"
                  ? "rescueSkills"
                  : "sportsSwimming",
            frequency:
              data.frequency === "2"
                ? "2timesWeek"
                : data.frequency === "3"
                  ? "3timesWeek"
                  : "4timesWeek",
            healthStatus: {
              heartDisease: data.healthHistory.includes("heart"),
              asthma: data.healthHistory.includes("asthma"),
              jointProblems: data.healthHistory.includes("joint"),
              highBloodPressure: data.healthHistory.includes("bp"),
              other: data.healthHistory.includes("other"),
              otherDetails: "",
            },
          },
        }),
      });

      const dataAI = (await res.json()) as AIResponse;
      if (!res.ok) throw new Error(dataAI.error || `AI error ${res.status}`);

      const structured = dataAI.structured || null;
      if (!structured) throw new Error("Không nhận được lộ trình hợp lệ.");

      setChatMessages([
        { role: "user", content: userSummary },
        { role: "ai", content: dataAI.message || "Mình đã tạo lộ trình dành riêng cho bạn." },
      ]);
      setPlan(structured);
      setSource(dataAI.source === "fallback" ? "fallback" : "ai");
      setHeroTitle(structured.title || `Lộ trình học bơi an toàn cho học viên ${data.age} tuổi`);
      setStatus("success");
      setLastError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không tạo được lộ trình.";
      setChatMessages([
        { role: "user", content: userSummary },
        { role: "ai", content: `Lỗi: ${msg}` },
      ]);
      setLastError(msg);
      setStatus("error");
    }
  };

  const retryBuildPlan = () => {
    if (formData) void handleFormSubmit(formData);
  };

  const handleSendMessage = async (message: string) => {
    setChatMessages((prev) => [...prev, { role: "user", content: message }]);

    if (!plan) {
      setChatMessages((prev) => [...prev, { role: "ai", content: "Vui lòng tạo lộ trình trước khi đặt câu hỏi nhé." }]);
      return;
    }

    setIsChatLoading(true);
    try {
      const history = [...chatMessages, { role: "user" as const, content: message }];
      const res = await fetch("/api/ai/roadmap/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          structured: plan,
          history: history.map((item) => ({ role: item.role, content: item.content })),
          userMessage: message,
        }),
      });

      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

      setChatMessages((prev) => [...prev, { role: "ai", content: data.message || "Mình chưa có câu trả lời phù hợp." }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: `Lỗi: ${err instanceof Error ? err.message : "Không xác định"}` },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const askAboutWeek = (week: number) => {
    void handleSendMessage(`Xin tư vấn điều chỉnh chi tiết cho tuần ${week}: khối lượng, quãng bơi và bài tập khô.`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />

      <main className="flex-1 pb-16 pt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-[var(--foreground)]">
              Khám phá lộ trình học bơi an toàn
            </h1>
            <p className="text-lg text-muted-foreground">
              Tạo lộ trình 8 tuần được cá nhân hóa dựa trên độ tuổi, sức khỏe và mục tiêu của bạn.
            </p>
          </div>

          {status === "idle" ? (
            <RoadmapForm onSubmit={handleFormSubmit} />
          ) : (
            <div className="space-y-8">
              {status === "generating" ? <LoadingPlanCard /> : null}

              {status === "error" && lastError ? (
                <div className="rounded-xl border bg-amber-50 p-4 text-amber-900" role="alert">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold">Tạm thời chưa tạo được lộ trình</p>
                      <p className="mt-1 text-sm">
                        {lastError}. Bạn có thể thử lại hoặc kiểm tra cấu hình GEMINI_API_KEY.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={retryBuildPlan}
                      className="rounded-lg border px-3 py-2 text-amber-900 hover:bg-amber-100"
                    >
                      Thử lại
                    </button>
                  </div>
                </div>
              ) : null}

              {hasPlan && formData ? (
                <>
                  <div className="rounded-2xl border bg-card p-8">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          source === "fallback" ? "bg-amber-100 text-amber-900" : "bg-sky-100 text-blue-700"
                        }`}
                      >
                        {source === "fallback" ? "Lộ trình mẫu" : "Lộ trình AI"}
                      </span>
                      {source === "fallback" ? (
                        <span className="text-sm text-muted-foreground">
                          Dùng để tham khảo khi AI chưa sẵn sàng hoặc trả dữ liệu chưa đúng định dạng.
                        </span>
                      ) : null}
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-card-foreground">{heroTitle}</h2>
                    <p className="text-muted-foreground">
                      {frequencyLabels[formData.frequency]} - Mục tiêu: {goalLabels[formData.goal]} - Trình độ:{" "}
                      {levelLabels[formData.level]}
                    </p>
                  </div>

                  <WeeklyTimeline plan={plan} onAskWeek={askAboutWeek} defaultSessionsPerWeek={sessionsPerWeekNum} />
                  <SafetyChecklist safety={plan?.safety} />
                  <GoalNotes planGoalNotes={plan?.goalNotes} goalKey={formData?.goal} />
                  <ChatPanel messages={chatMessages} onSendMessage={handleSendMessage} isLoading={isChatLoading} />
                </>
              ) : null}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
