"use client";
import { useState } from "react";
import ChatBubble from "./ChatBubble";

type Msg = { from: "user" | "ai"; content: string };

export default function AIChatPanel({ structured }: { structured: any }) {
  const [history, setHistory] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    const content = input.trim();
    if (!content || busy) return;
    setHistory((h) => [...h, { from: "user", content }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/ai/roadmap/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          structured,
          history: history.map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.content,
          })),
          userMessage: content,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setHistory((h) => [...h, { from: "ai", content: data.message }]);
    } catch (e: any) {
      setHistory((h) => [...h, { from: "ai", content: `❌ ${e?.message || "Lỗi không xác định"}` }]);
    }
    setBusy(false);
  };

  return (
    <section className="mt-10">
      <h3 className="text-xl font-semibold mb-3">Chat với trợ lý (dựa trên lộ trình)</h3>
      <div className="bg-white border rounded-xl p-4">
        <div className="max-h-[360px] overflow-y-auto pr-2">
          {history.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Gợi ý hỏi: “Tuần 3 bơi bao nhiêu mét?”, “Nếu hen thì giảm thế nào?”, “Đổi 2 buổi/tuần được không?”…
            </p>
          ) : (
            history.map((m, i) => (
              <ChatBubble key={i} from={m.from}>
                {m.content}
              </ChatBubble>
            ))
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Nhập câu hỏi…"
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <button
            onClick={send}
            disabled={busy || !input.trim()}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
          >
            {busy ? "Đang trả lời…" : "Gửi"}
          </button>
        </div>
      </div>
    </section>
  );
}
