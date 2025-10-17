import Header from "@/components/header";
import Footer from "@/components/footer";
import { videos } from "@/lib/data/skills";

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Nâng cao kỹ năng phòng chống đuối nước
              </h1>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Thông qua các video mô phỏng
              </h1>
            </div>
            <div className="text-right text-gray-600 max-w-md">
              <p>
                <div>  Floaty cung cấp video mô phỏng</div>
                <div>cách xử lý khi đối mặt với tình huống đuối nước</div>
                và kết hợp những cơ hội giúp có động kiến thức
              </p>
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Video Section */}
                <div className="aspect-video bg-gray-200">
                  <video
                    controls
                    className="w-full h-full object-cover"
                    src={video.thumbnail || "/placeholder.mp4"}
                    
                  >
                    Trình duyệt của bạn không hỗ trợ thẻ video.
                  </video>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-accent leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
