"use client";

import { useState } from "react";

export default function WeeklyTimeline({
  plan,
  onAskWeek,
  defaultSessionsPerWeek = 3, // 👈 nhận số buổi/tuần từ form
}: {
  plan?: { weeklyPlan?: any[] } | null;
  onAskWeek?: (week: number) => void;
  defaultSessionsPerWeek?: number;
}) {
  // Nếu AI có weeklyPlan thì dùng, nhưng đảm bảo mỗi tuần có sessionsPerWeek;
  // nếu thiếu -> gán bằng defaultSessionsPerWeek từ form
  const weekly = (plan?.weeklyPlan && Array.isArray(plan.weeklyPlan) && plan.weeklyPlan.length
    ? plan.weeklyPlan
    : Array.from({ length: 8 }).map((_, i) => ({
        week: i + 1,
        pool: [
          { name: "Làm quen nước & thở", durationMin: 25, drills: ["thở ra dưới nước 3×10", "trượt nước 6–8 lần"] },
          { name: "Nổi sấp/ngửa",        durationMin: 20, drills: ["nổi sao biển 3×20s", "đổi tư thế sấp-ngửa"] },
        ],
        dry: ["xoay khớp toàn thân 5’", "core nhẹ 3×20s"],
        checkpoints: ["giữ nổi 20–30s", "thổi bong bóng dưới nước"],
        notesForConditions: [],
      }))
  ).map((w: any) => ({
    ...w,
    sessionsPerWeek:
      typeof w.sessionsPerWeek === "number" && w.sessionsPerWeek > 0
        ? w.sessionsPerWeek
        : defaultSessionsPerWeek, // 👈 ép về số buổi/tuần chọn ở form
  }));

  const [expanded, setExpanded] = useState<number[]>([1]);
  const toggleWeek = (w: number) =>
    setExpanded((prev) => (prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]));

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold mb-6 text-card-foreground">Lộ trình 8 Tuần</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weekly.map((w: any) => {
          const minutes = Array.isArray(w.pool)
            ? w.pool.reduce((sum: number, p: any) => sum + (p?.durationMin || 0), 0)
            : 0;

          return (
            <div key={w.week} className="rounded-xl overflow-hidden border bg-card">
              {/* Header */}
              <button
                onClick={() => toggleWeek(w.week)}
                className="w-full p-4 text-left hover:opacity-80 transition border-b bg-muted/40"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-lg text-card-foreground">Tuần {w.week}</h4>
                    <p className="text-sm text-muted-foreground">
                      {w.sessionsPerWeek} buổi/tuần • ~{Math.ceil(minutes / 60)}h/tuần
                    </p>
                  </div>
                  <span className="text-primary text-xl">{expanded.includes(w.week) ? "−" : "+"}</span>
                </div>
              </button>

              {/* Content */}
              {expanded.includes(w.week) && (
                <div className="p-4 space-y-4">
                  {/* In-water */}
                  {Array.isArray(w.pool) && (
                    <div>
                      <h5 className="font-semibold mb-2 text-card-foreground">💧 Bài tập trong nước</h5>
                      <div className="space-y-2">
                        {w.pool.map((p: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-lg bg-sky-50 border-l-4" style={{ borderColor: "var(--primary)" }}>
                            <p className="font-medium text-card-foreground">
                              {p.name} {p.durationMin ? `• ${p.durationMin}’` : ""}
                            </p>
                            {Array.isArray(p.drills) && p.drills.length > 0 && (
                              <ul className="mt-1 ml-4 text-sm text-muted-foreground list-disc">
                                {p.drills.map((d: string, i: number) => <li key={i}>{d}</li>)}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dry */}
                  {Array.isArray(w.dry) && w.dry.length > 0 && (
                    <div>
                      <h5 className="font-semibold mb-2 text-card-foreground">🏃 Bài tập khô</h5>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4">
                        {w.dry.map((d: string, i: number) => <li key={i}>{d}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Checkpoints */}
                  {Array.isArray(w.checkpoints) && w.checkpoints.length > 0 && (
                    <div>
                      <h5 className="font-semibold mb-2 text-card-foreground">✓ Tiêu chí hoàn thành</h5>
                      <div className="space-y-1">
                        {w.checkpoints.map((c: string, i: number) => (
                          <label key={i} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: "var(--secondary)" }} />
                            <span className="text-sm text-muted-foreground">{c}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Health notes */}
                  {Array.isArray(w.notesForConditions) && w.notesForConditions.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-50 border-l-4 border-amber-400">
                      <p className="text-sm text-amber-900">
                        <strong>⚠️ Lưu ý:</strong> {w.notesForConditions.join(" ")}
                      </p>
                    </div>
                  )}

                  {/* Ask assistant */}
                  <button
                    onClick={() => onAskWeek?.(w.week)}
                    className="w-full py-2 text-sm rounded-lg border text-primary bg-sky-50"
                  >
                    Hỏi trợ lý về tuần này
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
