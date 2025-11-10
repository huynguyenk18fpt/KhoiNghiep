"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import RoadmapForm from "@/components/roadmap/roadmap-form";
import ChatPanel from "@/components/roadmap/chat-panel";
import WeeklyTimeline from "@/components/roadmap/weekly-timeline";
import SafetyChecklist from "@/components/roadmap/safety-checklist";
import GoalNotes from "@/components/roadmap/goal-notes";
import ChatBubble from "@/components/ChatBubble"; // bạn đã nói là có sẵn

type ChatMsg = { role: "user" | "ai"; content: string };

type AIResponse = {
  message: string;
  structured?: {
    title?: string;
    weeklyPlan?: any[];
    safety?: string[];
    dryExercises?: string[];
    goalNotes?: string[];
  } | null;
};

export default function RoadmapPage() {
  const [formData, setFormData] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null); // structured từ AI để render lại
  const [heroTitle, setHeroTitle] = useState<string>("");
  const [roadmapGenerated, setRoadmapGenerated] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const sessionsPerWeekNum = Number(formData?.frequency || 3);
  // gọi API tạo lộ trình
  const handleFormSubmit = async (data: any) => {
    setFormData(data);
    setRoadmapGenerated(true);
    setLastError(null);

    const userSummary = `Tạo lộ trình học bơi cho bé ${data.age} tuổi, ${data.height}cm/${data.weight}kg, trình độ ${data.level}, mục tiêu ${data.goal}, ${data.frequency} buổi/tuần${
      data.healthHistory?.length ? `, tiền sử: ${data.healthHistory.join(", ")}` : ""
    }.`;

    // chat mở đầu
    setChatMessages([
      { role: "user", content: userSummary },
      { role: "ai", content: "Đang tạo lộ trình an toàn và phù hợp cho bạn…" },
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
            // map từ form FE (beginner/intermediate/advanced)
            skillLevel: (data.level as "beginner" | "intermediate" | "advanced") ?? "",
            // map từ form FE (suc-khoe / cuu-ho / the-thao) sang BE
            goal:
              (data.goal === "suc-khoe"
                ? "swimmingForHealth"
                : data.goal === "cuu-ho"
                ? "rescueSkills"
                : data.goal === "the-thao"
                ? "sportsSwimming"
                : "") as any,
            // map tần suất: "2" -> "2timesWeek"
            frequency:
              (data.frequency === "2"
                ? "2timesWeek"
                : data.frequency === "3"
                ? "3timesWeek"
                : data.frequency === "4"
                ? "4timesWeek"
                : "") as any,
            // map healthHistory checkbox
            healthStatus: {
              heartDisease: data.healthHistory?.includes("heart") ?? false,
              asthma: data.healthHistory?.includes("asthma") ?? false,
              jointProblems: data.healthHistory?.includes("joint") ?? false,
              highBloodPressure: data.healthHistory?.includes("bp") ?? false,
              other: data.healthHistory?.includes("other") ?? false,
              otherDetails: "",
            },
          },
        }),
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.error || `AI error ${res.status}`);
      }

      const dataAI: AIResponse = await res.json();

      // thay câu "đang tạo..." bằng câu thật từ AI
      setChatMessages((prev) => [
        prev[0],
        { role: "ai", content: dataAI.message || "Mình đã tạo lộ trình dành riêng cho bạn!" },
      ]);

      const structured = dataAI.structured || null;
      setPlan(structured);
      setHeroTitle(structured?.title || `Lộ trình học bơi an toàn cho bé ${data.age} tuổi`);
      setLastError(null);
    } catch (err: any) {
      const msg = err?.message || "Không tạo được lộ trình (có thể model quá tải).";
      setChatMessages((prev) => [prev[0], { role: "ai", content: `❌ ${msg}` }]);
      setLastError(msg);
    }
    setIsLoadingAI(false);
  };

  // nút "Thử lại" ở banner
  const retryBuildPlan = () => {
    if (formData) {
      void handleFormSubmit(formData);
    }
  };

  // chat realtime sau khi đã có plan
  const handleSendMessage = async (message: string) => {
    setChatMessages((prev) => [...prev, { role: "user", content: message }]);

    if (!plan) {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: "Vui lòng tạo lộ trình trước khi đặt câu hỏi nhé!" },
      ]);
      return;
    }

    setIsLoadingAI(true);
    try {
      const res = await fetch("/api/ai/roadmap/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          structured: plan,
          history: chatMessages.map((m) => ({ role: m.role, content: m.content })),
          userMessage: message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      setChatMessages((prev) => [...prev, { role: "ai", content: data.message }]);
    } catch (e: any) {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: `❌ ${e?.message || "Lỗi không xác định"}` },
      ]);
    }
    setIsLoadingAI(false);
  };

  // click từ “Hỏi trợ lý về tuần này”
  const askAboutWeek = (week: number) => {
    handleSendMessage(
      `Xin tư vấn điều chỉnh chi tiết cho Tuần ${week} (khối lượng, quãng bơi, bài tập khô).`,
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />

      <main className="flex-1 pt-8 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-[var(--foreground)]">
              Khám phá Lộ trình Học Bơi An Toàn
            </h1>
            <p className="text-lg text-muted-foreground">
              Tạo lộ trình 8 tuần được cá nhân hóa dựa trên độ tuổi, sức khỏe và mục tiêu của bạn
            </p>
          </div>

          {!roadmapGenerated ? (
            <RoadmapForm onSubmit={handleFormSubmit} />
          ) : (
            <div className="space-y-8">
              {/* Banner lỗi nếu có */}
              {lastError && (
                <div className="rounded-xl border bg-amber-50 text-amber-900 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">Tạm thời chưa tạo được lộ trình</p>
                      <p className="text-sm mt-1">
                        {lastError}. Hệ thống đã tự động cấu hình retry + fallback. Bạn có thể bấm
                        “Thử lại”.
                      </p>
                    </div>
                    <button
                      onClick={retryBuildPlan}
                      className="px-3 py-2 rounded-lg border text-amber-900 hover:bg-amber-100"
                    >
                      Thử lại
                    </button>
                  </div>
                </div>
              )}

              {/* Hero Card */}
              <div className="rounded-2xl p-8 border bg-card">
                <h2 className="text-2xl font-bold mb-2 text-card-foreground">
                  {heroTitle || `Lộ trình học bơi an toàn cho bé ${formData?.age} tuổi`}
                </h2>
                <p className="text-muted-foreground">
                  {formData?.frequency} buổi/tuần • Mục tiêu: {formData?.goal} • Trình độ:{" "}
                  {formData?.level}
                </p>
              </div>

              {/* chat mở đầu dạng bubble nhỏ */}
              <div className="bg-muted/40 rounded-2xl p-4 border">
                {chatMessages.map((m, i) => (
                  <div key={i} className="mb-2">
                    <ChatBubble from={m.role === "user" ? "user" : "ai"}>{m.content}</ChatBubble>
                  </div>
                ))}
              </div>

              {/* timeline */}
              <WeeklyTimeline plan={plan} onAskWeek={askAboutWeek}
               defaultSessionsPerWeek={sessionsPerWeekNum}  // 👈 thêm prop này 
               />

              {/* checklist */}
              <SafetyChecklist safety={plan?.safety} />

              {/* goal notes */}
              <GoalNotes planGoalNotes={plan?.goalNotes} goalKey={formData?.goal} />

              {/* chat panel chính */}
              <ChatPanel
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                isLoading={isLoadingAI}
                formData={formData}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
