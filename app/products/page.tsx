"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { cartStore } from "@/lib/local-store";
import { formatPrice, products, type Product } from "@/lib/data/products";

export default function ProductsPage() {
  const [addedId, setAddedId] = useState<string | null>(null);
  const combos = products.filter((product) => product.category === "combo");
  const equipment = products.filter((product) => product.category === "equipment");

  const addToCart = async (product: Product) => {
    await cartStore.add(product.id);
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1800);
  };

  const handleContact = (name: string) => {
    const message = `Chào bạn, tôi muốn mua sản phẩm "${name}".`;
    const messengerLink = `https://m.me/865622756624048?text=${encodeURIComponent(message)}`;
    window.open(messengerLink, "_blank", "noopener,noreferrer");
  };

  const renderProduct = (product: Product) => (
    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300">
      <div className="aspect-square bg-white p-8 relative">
        <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-contain p-8" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-lg font-bold text-blue-600 mb-4">{formatPrice(product.price)}</p>
        {product.description && <p className="text-sm text-gray-600 mb-4">{product.description}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => addToCart(product)}>
            {addedId === product.id ? "Đã thêm" : "Thêm vào giỏ"}
          </Button>
          <Button variant="outline" className="bg-transparent" onClick={() => handleContact(product.name)}>
            Liên hệ mua
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Combo trang bị</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{combos.map(renderProduct)}</div>
          </section>

          <section>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Trang bị lẻ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{equipment.map(renderProduct)}</div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
