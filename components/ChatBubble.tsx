export default function ChatBubble({
  from = "ai",
  children,
}: {
  from?: "user" | "ai";
  children: React.ReactNode;
}) {
  const isAI = from === "ai";
  return (
    <div className={`w-full flex ${isAI ? "justify-start" : "justify-end"} my-2`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow
        ${isAI ? "bg-white border" : "bg-blue-600 text-white"}`}
      >
        {children}
      </div>
    </div>
  );
}
