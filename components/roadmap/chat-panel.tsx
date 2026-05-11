"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Msg = { role: "user" | "ai"; content: string };

export default function ChatPanel({
  messages,
  onSendMessage,
  isLoading,
}: {
  messages: Msg[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const quickSuggestions = [
    "Tăng quãng bơi tuần 3",
    "Nếu bé ho thì nghỉ thế nào?",
    "Đổi sang 2 buổi/tuần",
    "Bé sợ nước phải làm sao?",
  ];

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <section className="flex h-[600px] flex-col overflow-hidden rounded-2xl border bg-card" aria-labelledby="chat-title">
      <div className="border-b bg-muted/40 p-4">
        <h3 id="chat-title" className="font-bold text-card-foreground">
          Trợ lý AI
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">Hỏi thêm về lộ trình, cường độ và lưu ý an toàn.</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite" aria-busy={isLoading}>
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs rounded-lg px-4 py-2 shadow-sm lg:max-w-md ${
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading ? (
          <div className="flex justify-start">
            <div className="rounded-lg bg-muted px-4 py-3" role="status" aria-label="Trợ lý đang trả lời">
              <div className="flex space-x-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0.1s" }} />
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        ) : null}

        <div ref={endRef} />
      </div>

      {messages.length <= 2 ? (
        <div className="space-y-2 border-t px-4 py-3">
          <p className="text-xs text-muted-foreground">Gợi ý nhanh:</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSendMessage(suggestion)}
                disabled={isLoading}
                className="rounded-full border px-3 py-1 text-xs text-primary disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="border-t p-4">
        <div className="flex gap-2">
          <label htmlFor="roadmap-chat-input" className="sr-only">
            Nhập câu hỏi cho trợ lý AI
          </label>
          <input
            id="roadmap-chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Nhập câu hỏi..."
            className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2"
            disabled={isLoading}
          />
          <Button type="button" onClick={handleSend} disabled={isLoading || !input.trim()}>
            Gửi
          </Button>
        </div>
      </div>
    </section>
  );
}
