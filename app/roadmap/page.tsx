"use client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState } from "react";
import Form from "@/components/Form";
import { generateRoadmap } from "@/lib/data/generateRoadmap";
import { validateForm } from "@/lib/data/validateForm";
import RoadmapResult from "@/components/RoadmapResult";
import ChatBubble from "@/components/ChatBubble";
import AIChatPanel from "@/components/AIChatPanel";

type ChatMsg = { from: "user" | "ai"; content: string };
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
  const [generatedRoadmap, setGeneratedRoadmap] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string> | null>(null);
  const [busy, setBusy] = useState(false);
  const [chat, setChat] = useState<ChatMsg[]>([]);

  const handleSubmit = async (formData: any) => {
    const errors = validateForm(formData);
    setFormErrors(errors);
    const hasError = Object.values(errors).some((e) => e);
    if (hasError) return;

    const local = generateRoadmap(formData);
    setGeneratedRoadmap(local);

    setChat((old) => [
      ...old,
      {
        from: "user",
        content: `Tuổi ${formData.age}, ${formData.height}cm/${formData.weight}kg, trình độ: ${formData.skillLevel || "chưa chọn"}, mục tiêu: ${formData.goal || "chưa chọn"}, tần suất: ${formData.frequency || "chưa chọn"}.`,
      },
    ]);

    setBusy(true);
    try {
      const res = await fetch("/api/ai/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data?.error || `AI error ${res.status}`;
        setChat((old) => [...old, { from: "ai", content: `❌ ${msg}` }]);
        setBusy(false);
        return;
      }

      const data: AIResponse = await res.json();
      setChat((old) => [...old, { from: "ai", content: data.message }]);

      if (data.structured) {
        const better = {
          title: data.structured.title || local.title,
          description: "Lộ trình được điều chỉnh bởi AI dựa trên thông tin và an toàn.",
          goals: data.structured.goalNotes?.length ? data.structured.goalNotes : local.goals,
          weeklyPlan: data.structured.weeklyPlan || null,
          safety: data.structured.safety || null,
          dryExercises: data.structured.dryExercises || null,
        };
        setGeneratedRoadmap(better);
      }
    } catch (err: any) {
      setChat((old) => [
        ...old,
        { from: "ai", content: `❌ Không gọi được AI: ${err?.message || "unknown"}` },
      ]);
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Form onSubmit={handleSubmit} errors={formErrors} busy={busy} />

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">Trợ lý</h2>
            <div className="bg-gray-100 rounded-xl p-4 border">
              {chat.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Điền form và nhấn bắt đầu — trợ lý sẽ tư vấn lộ trình phù hợp và an toàn.
                </p>
              ) : (
                chat.map((m, i) => (
                  <ChatBubble key={i} from={m.from}>
                    {m.content}
                  </ChatBubble>
                ))
              )}
            </div>
          </section>

          {generatedRoadmap && <RoadmapResult roadmap={generatedRoadmap} />}

          {generatedRoadmap?.weeklyPlan && (
            <AIChatPanel structured={generatedRoadmap} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
