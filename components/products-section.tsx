"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice, products, type Product } from "@/lib/data/products";

const featuredProducts = products.filter((product) => product.category === "combo").slice(0, 2);

export default function ProductsSection() {
  const handleContact = (product: Product) => {
    const message = `Chào Floaty, tôi muốn mua/tư vấn sản phẩm "${product.name}" giá ${formatPrice(
      product.price,
    )}. Bạn hỗ trợ giúp tôi nhé.`;
    const messengerLink = `https://m.me/865622756624048?text=${encodeURIComponent(message)}`;
    window.open(messengerLink, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm của Floaty</h2>
            <p className="text-gray-600">Trang bị sẵn sàng cho việc chủ động phòng chống đuối nước.</p>
          </div>
          <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap">
            Xem tất cả
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="relative h-36 w-36 flex-shrink-0">
                    <Image src={product.image} alt={product.name} fill sizes="144px" className="object-contain" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-xl font-semibold text-blue-600 mb-4">{formatPrice(product.price)}</p>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleContact(product)}>
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      Liên hệ mua
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
