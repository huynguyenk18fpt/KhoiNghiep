export default function RoadmapResult({ roadmap }: { roadmap: any }) {
  return (
    <div className="mt-12">
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">Lộ trình học bơi</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-gray-800">{roadmap.title}</h3>
        {roadmap.description && <p className="text-gray-600 mb-4">{roadmap.description}</p>}

        {Array.isArray(roadmap.weeklyPlan) ? (
          <div className="space-y-5">
            {roadmap.weeklyPlan.map((w: any) => (
              <div key={w.week} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">Tuần {w.week}</h4>
                  {w.sessionsPerWeek && (
                    <span className="text-sm text-gray-500">{w.sessionsPerWeek} buổi/tuần</span>
                  )}
                </div>

                {Array.isArray(w.pool) && (
                  <div className="mt-3">
                    <p className="font-medium">Bài tập trong nước:</p>
                    <ul className="list-disc ml-5 mt-1 space-y-1">
                      {w.pool.map((p: any, idx: number) => (
                        <li key={idx}>
                          <span className="font-medium">{p.name}</span>
                          {p.durationMin ? ` — ${p.durationMin}’` : ""}{" "}
                          {Array.isArray(p.drills) && p.drills.length > 0 && (
                            <ul className="list-square ml-5 mt-1">
                              {p.drills.map((d: string, i: number) => (
                                <li key={i}>{d}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(w.dry) && w.dry.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">Bài tập khô:</p>
                    <ul className="list-disc ml-5 mt-1">
                      {w.dry.map((d: string, i: number) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(w.checkpoints) && w.checkpoints.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">Tiêu chí hoàn thành tuần:</p>
                    <ul className="list-disc ml-5 mt-1">
                      {w.checkpoints.map((c: string, i: number) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(w.notesForConditions) && w.notesForConditions.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium text-amber-700">Lưu ý theo bệnh nền:</p>
                    <ul className="list-disc ml-5 mt-1">
                      {w.notesForConditions.map((n: string, i: number) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <>
            <h4 className="font-medium text-gray-900 mb-2">Mục tiêu học:</h4>
            <ul className="list-disc pl-5">
              {roadmap.goals?.map((goal: string, idx: number) => (
                <li key={idx} className="text-gray-600">
                  {goal}
                </li>
              ))}
            </ul>
          </>
        )}

        {Array.isArray(roadmap.safety) && roadmap.safety.length > 0 && (
          <div className="mt-5">
            <p className="font-medium">Checklist an toàn:</p>
            <ul className="list-disc ml-5 mt-1">
              {roadmap.safety.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
