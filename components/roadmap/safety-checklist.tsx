export default function SafetyChecklist({ safety }: { safety?: string[] }) {
  const fallback = [
    "Luôn bơi với người khác hoặc dưới sự giám sát của người lớn/HLV.",
    "Kiểm tra điều kiện nước: độ sâu, dòng chảy và nhiệt độ.",
    "Không vượt quá khả năng; tránh bơi xa bờ hoặc khu vực cấm.",
    "Sử dụng phao cứu hộ hoặc thiết bị hỗ trợ khi cần.",
    "Không bơi khi mệt, chóng mặt hoặc sau khi dùng rượu/thuốc.",
    "Biết cách gọi cấp cứu và vị trí thiết bị cứu hộ.",
  ];

  const items = safety?.length ? safety : fallback;

  return (
    <div className="rounded-2xl p-8 border bg-card">
      <h3 className="text-xl font-bold mb-6 flex items-center text-card-foreground">Checklist an toàn</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <label key={item} className="flex items-start gap-3 cursor-pointer group">
            <input type="checkbox" className="w-5 h-5 rounded mt-1" style={{ accentColor: "var(--secondary)" }} />
            <span className="text-muted-foreground leading-7">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
