"use client";

import Image from "next/image";
import { MessageCircle, ShieldCheck, Sparkles, Users } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { formatPrice, products, type Product } from "@/lib/data/products";

const trustBadges = [
  { icon: ShieldCheck, label: "Tư vấn chọn combo an toàn" },
  { icon: Users, label: "Phù hợp trẻ em và người mới học bơi" },
  { icon: Sparkles, label: "Hỗ trợ tại Cần Thơ và online" },
];

export default function ProductsPageClient() {
  const combos = products.filter((product) => product.category === "combo");
  const equipment = products.filter((product) => product.category === "equipment");

  const handleContact = (product: Product) => {
    const message = `Chào Floaty, tôi muốn mua/tư vấn sản phẩm "${product.name}" giá ${formatPrice(
      product.price,
    )}. Bạn hỗ trợ giúp tôi nhé.`;
    const messengerLink = `https://m.me/865622756624048?text=${encodeURIComponent(message)}`;
    window.open(messengerLink, "_blank", "noopener,noreferrer");
  };

  const renderProduct = (product: Product, priority = false) => (
    <article
      key={product.id}
      className="overflow-hidden rounded-lg border border-sky-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square bg-white">
        <Image
          src={product.image}
          alt={`${product.name} - sản phẩm bơi lội an toàn Floaty`}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="object-contain p-6 sm:p-8"
          priority={priority}
        />
      </div>
      <div className="flex min-h-[220px] flex-col p-5 sm:p-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold leading-snug text-gray-950 sm:text-xl">{product.name}</h3>
          <p className="mt-2 text-xl font-bold text-blue-600">{formatPrice(product.price)}</p>
          {product.description ? (
            <p className="mt-3 text-sm leading-6 text-gray-600">{product.description}</p>
          ) : null}
        </div>

        <Button
          className="mt-5 h-11 w-full bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => handleContact(product)}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Liên hệ mua
        </Button>
      </div>
    </article>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pb-16 pt-8 sm:pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="mb-10 py-4 sm:py-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Floaty Store</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Trang bị bơi lội an toàn cho trẻ em và gia đình
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
              Chọn combo và phụ kiện hỗ trợ học bơi, luyện tập kỹ năng nước và phòng chống đuối nước. Floaty tư vấn
              trực tiếp qua Messenger để bạn chọn đúng sản phẩm theo nhu cầu.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-md bg-sky-50 px-4 py-3 text-sm text-sky-900">
                  <Icon className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
                  <span className="font-medium leading-5">{label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-14">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Combo</p>
                <h2 className="mt-1 text-2xl font-bold text-gray-950 sm:text-3xl">Combo trang bị</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {combos.map((product, index) => renderProduct(product, index === 0))}
            </div>
          </section>

          <section>
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Phụ kiện</p>
              <h2 className="mt-1 text-2xl font-bold text-gray-950 sm:text-3xl">Trang bị lẻ</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {equipment.map((product) => renderProduct(product))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
