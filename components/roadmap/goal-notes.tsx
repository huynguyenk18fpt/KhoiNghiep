export default function GoalNotes({
  planGoalNotes,
  goalKey,
}: {
  planGoalNotes?: string[] | null;
  goalKey?: "suc-khoe" | "cuu-ho" | "the-thao";
}) {
  const fallback: Record<string, string> = {
    "suc-khoe": "Tập trung thích nghi nước, nhịp thở đều và tăng dần sức bền. Duy trì 2-4 buổi/tuần và theo dõi mức mệt.",
    "cuu-ho": "Nhấn mạnh nhận diện nguy hiểm, giữ bình tĩnh, kỹ năng tự cứu, tìm trợ giúp và tiếp cận an toàn.",
    "the-thao": "Tăng kỹ thuật và sức bền theo từng bước. Luôn khởi động kỹ, phục hồi đủ và tránh quá tải vai/khớp.",
  };

  const text =
    planGoalNotes && planGoalNotes.length
      ? planGoalNotes.join(" ")
      : fallback[goalKey || "suc-khoe"] || "Bám sát lộ trình và ưu tiên an toàn.";

  return (
    <section className="rounded-2xl border bg-card p-8" aria-labelledby="goal-notes-title">
      <h3 id="goal-notes-title" className="mb-4 text-xl font-bold text-card-foreground">
        Ghi chú theo mục tiêu
      </h3>
      <p className="leading-7 text-muted-foreground">{text}</p>
    </section>
  );
}
