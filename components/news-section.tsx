import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

const newsItems = [
  {
    id: 1,
    title: "Bé trai tử miền Nam theo gia đình về quê tắm thúc Đen bị đuối nước tử vong",
    description:
      "Khoảng 13h ngày 16/7, tại khu vực thúc Đen, xã Thành Vinh, tỉnh Thành Hóa xảy ra vụ đuối nước làm một bé trai tử vong.",
    image: "https://baogiaothong.mediacdn.vn/zoom/700_438/603483875699699712/2025/7/16/dn1-1752663594072367286817-0-0-500-800-crop-17526636019861225299347.jpg",
    date: "16/7",
  },
  {
    id: 2,
    title: "Đắk Lắk: Tìm thấy người đàn ông đuối nước ở hồ Phú Xuân",
    description:
      "Ngày 15/7, ông Nguyễn Ngọc Tuấn, Chủ tịch Ủy ban nhân dân xã Xuân Phước, tỉnh Đắk Lắk xác nhận, đã tìm thấy thi thể người đàn ông bị đuối nước tại hồ chứa nước thủy lợi Phú Xuân lúc 10 giờ 30 phút cùng ngày.",
    image: "https://cdn.nhandan.vn/images/a18751b147ad6a48c74565099ca2eb9d7093c2d52d839dbc4d306ac71cc2f2a9bce5d8df1375d7c2dc9f247558cf1e77f746c6aa49d3d370a9c076951bc894af8fa2f4c863308048dc7f2c3e2854d97e78e72b56c5efc5e4b7980a83172a7883/z6805985037024-45c75e963f90f5bd0a1038f3157697b6-7615-1422.jpg",
    date: "15/7",
  },
  {
    id: 3,
    title: "Hai anh em đuối nước khi cứu nhau dưới kênh Ngăn Trời",
    description:
      "Hà Tĩnh - Bé trai 4 tuổi trượt chân xuống cửu thủy lợi, anh 12 tuổi nhảy xuống cứu nhưng không thành, bị cuốn đi vả tử vong, chiều 28/6",
    image: "https://cdn.tienphong.vn/images/a6bf4f60924201126af6849ca45a39805e583f014d5db088187749f371d6515202ac45dfd275c5f82862787dfb7df6237955d4a755ba1f54d14e73e4fe81960da315807230a931bc345db57094869c730959f016defdfeea22a26e75e0843aaadb5148215f52917b96826a7902b27985dda5e91d3e716cd9211f432557a2a843/z675225129708196c2825ddd57f83bc383476924a50663-edited-1751124274353-1604-3914.jpg",
    date: "28/6",
  },
]

export default function NewsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Tin tức</h2>
            <p className="text-gray-600">Cập nhật nhanh chóng các thông tin về tình trạng đuối nước cùng Floaty</p>
          </div>
          <Link href="/news" className="text-blue-600 hover:text-blue-700 font-medium">
            Xem tất cả
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-contain" />
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>
                <div className="text-xs text-gray-500">Ngày {item.date}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
