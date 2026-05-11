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

  const weekly = (plan?.weeklyPlan?.length ? plan.weeklyPlan : fallbackWeekly).map((week) => ({
    ...week,
    sessionsPerWeek:
      typeof week.sessionsPerWeek === "number" && week.sessionsPerWeek > 0
        ? week.sessionsPerWeek
        : defaultSessionsPerWeek,
  }));

  const [expanded, setExpanded] = useState<number[]>([1]);
  const toggleWeek = (week: number) => {
    setExpanded((prev) => (prev.includes(week) ? prev.filter((item) => item !== week) : [...prev, week]));
  };

  return (
    <section className="space-y-4" aria-labelledby="weekly-timeline-title">
      <h3 id="weekly-timeline-title" className="mb-6 text-2xl font-bold text-card-foreground">
        Lộ trình 8 tuần
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {weekly.map((week) => {
          const isExpanded = expanded.includes(week.week);
          const minutes = Array.isArray(week.pool)
            ? week.pool.reduce((sum, part) => sum + (part.durationMin || 0), 0)
            : 0;
          const panelId = `roadmap-week-${week.week}`;

          return (
            <div key={week.week} className="overflow-hidden rounded-xl border bg-card">
              <button
                type="button"
                onClick={() => toggleWeek(week.week)}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                className="w-full border-b bg-muted/40 p-4 text-left transition hover:opacity-80"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-card-foreground">Tuần {week.week}</h4>
                    <p className="text-sm text-muted-foreground">
                      {week.sessionsPerWeek} buổi/tuần - khoảng {Math.ceil(minutes / 60)} giờ/tuần
                    </p>
                  </div>
                  <span className="text-xl text-primary" aria-hidden="true">
                    {isExpanded ? "-" : "+"}
                  </span>
                </div>
              </button>

              {isExpanded ? (
                <div id={panelId} className="space-y-4 p-4">
                  {Array.isArray(week.pool) ? (
                    <div>
                      <h5 className="mb-2 font-semibold text-card-foreground">Bài tập trong nước</h5>
                      <div className="space-y-2">
                        {week.pool.map((part, index) => (
                          <div
                            key={index}
                            className="rounded-lg border-l-4 bg-sky-50 p-3"
                            style={{ borderColor: "var(--primary)" }}
                          >
                            <p className="font-medium text-card-foreground">
                              {part.name} {part.durationMin ? `- ${part.durationMin} phút` : ""}
                            </p>
                            {Array.isArray(part.drills) && part.drills.length > 0 ? (
                              <ul className="ml-4 mt-1 list-disc text-sm text-muted-foreground">
                                {part.drills.map((drill, drillIndex) => (
                                  <li key={drillIndex}>{drill}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {Array.isArray(week.dry) && week.dry.length > 0 ? (
                    <div>
                      <h5 className="mb-2 font-semibold text-card-foreground">Bài tập khô</h5>
                      <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                        {week.dry.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {Array.isArray(week.checkpoints) && week.checkpoints.length > 0 ? (
                    <div>
                      <h5 className="mb-2 font-semibold text-card-foreground">Tiêu chí hoàn thành</h5>
                      <div className="space-y-1">
                        {week.checkpoints.map((checkpoint, index) => (
                          <label key={index} className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded"
                              style={{ accentColor: "var(--secondary)" }}
                            />
                            <span className="text-sm text-muted-foreground">{checkpoint}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {Array.isArray(week.notesForConditions) && week.notesForConditions.length > 0 ? (
                    <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-3">
                      <p className="text-sm text-amber-900">
                        <strong>Lưu ý:</strong> {week.notesForConditions.join(" ")}
                      </p>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => onAskWeek?.(week.week)}
                    className="w-full rounded-lg border bg-sky-50 py-2 text-sm text-primary"
                  >
                    Hỏi trợ lý về tuần này
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
