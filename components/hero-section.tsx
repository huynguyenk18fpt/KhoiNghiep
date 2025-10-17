import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">
            <span className="text-blue-600 block">{'Học kỹ năng Phòng Chống Đuối Nước'}</span>
            <span className="block">{'Cho Trẻ Em và Phụ Huynh'}</span>
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            {"Thông qua các Video và Trò chơi trực nghiệm"}
          </h2>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {"Nâng cao kỹ năng thông qua kiến thức từ các chuyên gia trong nghành"}
          </p>

          <Link href="/skills" passHref>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              {"Khám phá ngay →"}
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="relative max-w-4xl mx-auto">
          <Image
            src="/images/floaty-hero.png"
            alt="Floaty - Ngày thế giới phòng chống đuối nước"
            width={1200}
            height={600}
            className="w-full h-auto rounded-lg shadow-lg"
            priority
          />
        </div>
      </div>
    </section>
  )
}
