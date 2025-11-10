export default function GoalNotes({
  planGoalNotes,
  goalKey,
}: {
  planGoalNotes?: string[] | null;
  goalKey?: "suc-khoe" | "cuu-ho" | "the-thao";
}) {
  const fallback: Record<string, string> = {
    "suc-khoe":
      "Tập trung thích nghi nước, nhịp thở đều và tăng dần sức bền. Duy trì 2–4 buổi/tuần, theo dõi mức mệt.",
    "cuu-ho":
      "Nhấn mạnh nhận diện nguy hiểm, giữ bình tĩnh, kỹ năng tự cứu/tìm trợ giúp và tiếp cận an toàn.",
    "the-thao":
      "Tăng tốc độ, kỹ thuật cao và sức bền. Lưu ý khởi động kỹ, phục hồi đủ, tránh quá tải vai/khớp.",
  };

  const text =
    planGoalNotes && planGoalNotes.length
      ? planGoalNotes.join(" ")
      : fallback[goalKey || "suc-khoe"] || "Bám sát lộ trình và ưu tiên an toàn.";

  return (
    <div className="rounded-2xl p-8 border bg-card">
      <h3 className="text-xl font-bold mb-4 text-card-foreground">📋 Ghi chú theo mục tiêu</h3>
      <p className="text-muted-foreground leading-7">{text}</p>
      <div className="mt-6 flex gap-3">
        <button className="px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground">
          ⬇️ Tải PDF lộ trình
        </button>
        <button className="px-4 py-2 rounded-lg font-medium border text-primary">
          ⚙️ Chỉnh theo tần suất
        </button>
      </div>
    </div>
  );
}
