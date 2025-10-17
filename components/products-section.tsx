import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

const products = [
  {
    id: 1,
    name: "Combo cơ bản",
    price: "200.000 VND",
    image: "/COMBO/COMBO-CO-BAN.png",
  },
  {
    id: 2,
    name: "Combo rèn luyện",
    price: "600.000 VND",
    image: "/COMBO/COMBO-REN-LUYEN.png",
  },
]

export default function ProductsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm của Floaty</h2>
            <p className="text-gray-600">Cùng Floaty trang bị sẵn sàng cho việc chủ động Phòng chống đuối nước</p>
          </div>
          <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
            Xem tất cả
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-4"> {/* Căn giữa nội dung */}
                  <div className="flex-shrink-0">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={150}
                      height={150}
                      className="rounded-lg mb-2"
                    />
                  </div>
                  <div className="flex-1 text-center"> {/* Căn giữa văn bản */}
                    <h3 className="text-3xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <h3 className="text-2xl font-semibold text-blue-600 mb-2">{product.price}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
