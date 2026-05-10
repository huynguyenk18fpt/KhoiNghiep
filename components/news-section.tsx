import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { newsArticles } from "@/lib/data/news";

const newsItems = newsArticles.slice(0, 3);

export default function NewsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Tin tức</h2>
            <p className="text-gray-600">Cập nhật nhanh các thông tin về an toàn dưới nước cùng Floaty.</p>
          </div>
          <Link href="/news" className="text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap">
            Xem tất cả
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={item.link} target="_blank" rel="noopener noreferrer">
                <div className="aspect-video relative bg-gray-100">
                  <Image src={item.image} alt={item.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>
                  <div className="text-xs text-gray-500">Ngày {item.date}</div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
