"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import RoadmapForm, { type RoadmapFormValue } from "@/components/roadmap/roadmap-form";
import ChatPanel from "@/components/roadmap/chat-panel";
import WeeklyTimeline from "@/components/roadmap/weekly-timeline";
import SafetyChecklist from "@/components/roadmap/safety-checklist";
import GoalNotes from "@/components/roadmap/goal-notes";
import ChatBubble from "@/components/ChatBubble";

type ChatMsg = { role: "user" | "ai"; content: string };

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
  message: string;
  structured?: RoadmapPlan | null;
};

export default function RoadmapPage() {
  const [formData, setFormData] = useState<RoadmapFormValue | null>(null);
  const [plan, setPlan] = useState<RoadmapPlan | null>(null);
  const [heroTitle, setHeroTitle] = useState("");
  const [roadmapGenerated, setRoadmapGenerated] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const sessionsPerWeekNum = Number(formData?.frequency || 3);

  const handleFormSubmit = async (data: RoadmapFormValue) => {
    setFormData(data);
    setRoadmapGenerated(true);
    setLastError(null);
    setPlan(null);

    const userSummary = `Tạo lộ trình học bơi cho học viên ${data.age} tuổi, ${data.height}cm/${data.weight}kg, trình độ ${data.level}, mục tiêu ${data.goal}, ${data.frequency} buổi/tuần${
      data.healthHistory.length ? `, tiền sử: ${data.healthHistory.join(", ")}` : ""
    }.`;

    setChatMessages([
      { role: "user", content: userSummary },
      { role: "ai", content: "Đang tạo lộ trình an toàn và phù hợp cho bạn..." },
    ]);

    setIsLoadingAI(true);
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

      const dataAI = (await res.json()) as AIResponse & { error?: string };
      if (!res.ok) throw new Error(dataAI.error || `AI error ${res.status}`);

      setChatMessages((prev) => [
        prev[0],
        { role: "ai", content: dataAI.message || "Mình đã tạo lộ trình dành riêng cho bạn." },
      ]);

      const structured = dataAI.structured || null;
      setPlan(structured);
      setHeroTitle(structured?.title || `Lộ trình học bơi an toàn cho học viên ${data.age} tuổi`);
      setLastError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không tạo được lộ trình.";
      setChatMessages((prev) => [prev[0], { role: "ai", content: `Lỗi: ${msg}` }]);
      setLastError(msg);
    } finally {
      setIsLoadingAI(false);
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

    setIsLoadingAI(true);
    try {
      const res = await fetch("/api/ai/roadmap/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          structured: plan,
          history: chatMessages.map((item) => ({ role: item.role, content: item.content })),
          userMessage: message,
        }),
      });

      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

      setChatMessages((prev) => [...prev, { role: "ai", content: data.message || "Mình chưa có câu trả lời phù hợp." }]);
    } catch (err) {
      setChatMessages((prev) => [...prev, { role: "ai", content: `Lỗi: ${err instanceof Error ? err.message : "Không xác định"}` }]);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const askAboutWeek = (week: number) => {
    void handleSendMessage(`Xin tư vấn điều chỉnh chi tiết cho tuần ${week}: khối lượng, quãng bơi và bài tập khô.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />

      <main className="flex-1 pt-8 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-[var(--foreground)]">Khám phá lộ trình học bơi an toàn</h1>
            <p className="text-lg text-muted-foreground">
              Tạo lộ trình 8 tuần được cá nhân hóa dựa trên độ tuổi, sức khỏe và mục tiêu của bạn.
            </p>
          </div>

          {!roadmapGenerated ? (
            <RoadmapForm onSubmit={handleFormSubmit} />
          ) : (
            <div className="space-y-8">
              {lastError && (
                <div className="rounded-xl border bg-amber-50 text-amber-900 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">Tạm thời chưa tạo được lộ trình</p>
                      <p className="text-sm mt-1">{lastError}. Bạn có thể thử lại hoặc kiểm tra cấu hình GEMINI_API_KEY.</p>
                    </div>
                    <button onClick={retryBuildPlan} className="px-3 py-2 rounded-lg border text-amber-900 hover:bg-amber-100">
                      Thử lại
                    </button>
                  </div>
                </div>
              )}

              <div className="rounded-2xl p-8 border bg-card">
                <h2 className="text-2xl font-bold mb-2 text-card-foreground">
                  {heroTitle || `Lộ trình học bơi an toàn cho học viên ${formData?.age} tuổi`}
                </h2>
                <p className="text-muted-foreground">
                  {formData?.frequency} buổi/tuần - Mục tiêu: {formData?.goal} - Trình độ: {formData?.level}
                </p>
              </div>

              <div className="bg-muted/40 rounded-2xl p-4 border">
                {chatMessages.map((message, index) => (
                  <div key={index} className="mb-2">
                    <ChatBubble from={message.role === "user" ? "user" : "ai"}>{message.content}</ChatBubble>
                  </div>
                ))}
              </div>

              <WeeklyTimeline plan={plan} onAskWeek={askAboutWeek} defaultSessionsPerWeek={sessionsPerWeekNum} />
              <SafetyChecklist safety={plan?.safety} />
              <GoalNotes planGoalNotes={plan?.goalNotes} goalKey={formData?.goal} />
              <ChatPanel messages={chatMessages} onSendMessage={handleSendMessage} isLoading={isLoadingAI} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
