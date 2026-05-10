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
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="rounded-2xl overflow-hidden border bg-card flex flex-col h-[600px]">
      <div className="p-4 border-b bg-muted/40">
        <h3 className="font-bold text-card-foreground">Trợ lý AI</h3>
        <p className="text-xs text-muted-foreground mt-1">Hỏi thêm về lộ trình, cường độ và lưu ý an toàn.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-lg bg-muted">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full animate-bounce bg-primary" />
                <div className="w-2 h-2 rounded-full animate-bounce bg-primary" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 rounded-full animate-bounce bg-primary" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {messages.length <= 2 && (
        <div className="px-4 py-3 border-t space-y-2">
          <p className="text-xs text-muted-foreground">Gợi ý nhanh:</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion) => (
              <button key={suggestion} onClick={() => onSendMessage(suggestion)} className="px-3 py-1 text-xs rounded-full border text-primary">
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Nhập câu hỏi..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
          />
          <Button onClick={handleSend} disabled={isLoading}>
            Gửi
          </Button>
        </div>
      </div>
    </div>
  );
}
