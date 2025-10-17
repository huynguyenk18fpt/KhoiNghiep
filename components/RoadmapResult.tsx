export default function RoadmapResult({ roadmap }: { roadmap: any }) {
  return (
    <div className="mt-12">
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">Lộ trình học bơi</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-gray-800">{roadmap.title}</h3>
        <p className="text-gray-600 mb-4">{roadmap.description}</p>
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Mục tiêu học:</h4>
          <ul className="list-disc pl-5">
            {roadmap.goals.map((goal: string, index: number) => (
              <li key={index} className="text-gray-600">{goal}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
