"use client";

import { useState } from "react";

type WeeklyPlanItem = {
  week: number;
  sessionsPerWeek?: number;
  pool?: { name: string; durationMin?: number; drills?: string[] }[];
  dry?: string[];
  checkpoints?: string[];
  notesForConditions?: string[];
};

export default function WeeklyTimeline({
  plan,
  onAskWeek,
  defaultSessionsPerWeek = 3,
}: {
  plan?: { weeklyPlan?: WeeklyPlanItem[] } | null;
  onAskWeek?: (week: number) => void;
  defaultSessionsPerWeek?: number;
}) {
  const fallbackWeekly: WeeklyPlanItem[] = Array.from({ length: 8 }).map((_, index) => ({
    week: index + 1,
    pool: [
      { name: "Làm quen nước và thở", durationMin: 25, drills: ["thở ra dưới nước 3 x 10", "trượt nước 6-8 lần"] },
      { name: "Nổi sấp/ngửa", durationMin: 20, drills: ["nổi sao biển 3 x 20 giây", "đổi tư thế sấp-ngửa"] },
    ],
    dry: ["xoay khớp toàn thân 5 phút", "core nhẹ 3 x 20 giây"],
    checkpoints: ["giữ nổi 20-30 giây", "thổi bong bóng dưới nước"],
    notesForConditions: [],
  }));

  const weekly = (plan?.weeklyPlan?.length
    ? plan.weeklyPlan
    : fallbackWeekly
  ).map((week) => ({
    ...week,
    sessionsPerWeek:
      typeof week.sessionsPerWeek === "number" && week.sessionsPerWeek > 0 ? week.sessionsPerWeek : defaultSessionsPerWeek,
  }));

  const [expanded, setExpanded] = useState<number[]>([1]);
  const toggleWeek = (week: number) => {
    setExpanded((prev) => (prev.includes(week) ? prev.filter((item) => item !== week) : [...prev, week]));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold mb-6 text-card-foreground">Lộ trình 8 tuần</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weekly.map((week) => {
          const minutes = Array.isArray(week.pool)
            ? week.pool.reduce((sum, part) => sum + (part.durationMin || 0), 0)
            : 0;

          return (
            <div key={week.week} className="rounded-xl overflow-hidden border bg-card">
              <button
                onClick={() => toggleWeek(week.week)}
                className="w-full p-4 text-left hover:opacity-80 transition border-b bg-muted/40"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-lg text-card-foreground">Tuần {week.week}</h4>
                    <p className="text-sm text-muted-foreground">
                      {week.sessionsPerWeek} buổi/tuần - khoảng {Math.ceil(minutes / 60)} giờ/tuần
                    </p>
                  </div>
                  <span className="text-primary text-xl">{expanded.includes(week.week) ? "-" : "+"}</span>
                </div>
              </button>

              {expanded.includes(week.week) && (
                <div className="p-4 space-y-4">
                  {Array.isArray(week.pool) && (
                    <div>
                      <h5 className="font-semibold mb-2 text-card-foreground">Bài tập trong nước</h5>
                      <div className="space-y-2">
                        {week.pool.map((part, index) => (
                          <div key={index} className="p-3 rounded-lg bg-sky-50 border-l-4" style={{ borderColor: "var(--primary)" }}>
                            <p className="font-medium text-card-foreground">
                              {part.name} {part.durationMin ? `- ${part.durationMin} phút` : ""}
                            </p>
                            {Array.isArray(part.drills) && part.drills.length > 0 && (
                              <ul className="mt-1 ml-4 text-sm text-muted-foreground list-disc">
                                {part.drills.map((drill, drillIndex) => (
                                  <li key={drillIndex}>{drill}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(week.dry) && week.dry.length > 0 && (
                    <div>
                      <h5 className="font-semibold mb-2 text-card-foreground">Bài tập khô</h5>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4">
                        {week.dry.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Array.isArray(week.checkpoints) && week.checkpoints.length > 0 && (
                    <div>
                      <h5 className="font-semibold mb-2 text-card-foreground">Tiêu chí hoàn thành</h5>
                      <div className="space-y-1">
                        {week.checkpoints.map((checkpoint, index) => (
                          <label key={index} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: "var(--secondary)" }} />
                            <span className="text-sm text-muted-foreground">{checkpoint}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(week.notesForConditions) && week.notesForConditions.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-50 border-l-4 border-amber-400">
                      <p className="text-sm text-amber-900">
                        <strong>Lưu ý:</strong> {week.notesForConditions.join(" ")}
                      </p>
                    </div>
                  )}

                  <button onClick={() => onAskWeek?.(week.week)} className="w-full py-2 text-sm rounded-lg border text-primary bg-sky-50">
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
