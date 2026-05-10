"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { cartStore, hydrateCart, type CartItem } from "@/lib/local-store";
import { formatPrice } from "@/lib/data/products";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    cartStore.getItems().then(setCartItems).catch(() => setCartItems([]));
  }, []);

  const hydratedItems = useMemo(() => hydrateCart(cartItems), [cartItems]);
  const total = hydratedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const persist = async (items: CartItem[]) => {
    setCartItems(items);
    const savedItems = await cartStore.setItems(items);
    setCartItems(savedItems);
  };

  const updateQuantity = (productId: string, change: number) => {
    void persist(
      cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.max(1, item.quantity + change) } : item,
      ),
    );
  };

  const removeItem = (productId: string) => {
    void persist(cartItems.filter((item) => item.productId !== productId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Giỏ hàng của bạn</h1>

        {hydratedItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-500 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
            <Link href="/products">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base">Tiếp tục mua sắm</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {hydratedItems.map((item) => (
                <div key={item.productId} className="bg-white rounded-lg shadow-sm p-6 flex flex-col sm:flex-row gap-6 sm:items-center">
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
                    <Image src={item.product.image} alt={item.product.name} fill sizes="96px" className="object-contain p-2" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.product.name}</h3>
                    <p className="text-blue-600 font-semibold text-lg">{formatPrice(item.product.price)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={() => updateQuantity(item.productId, -1)} className="h-10 w-10">
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-semibold w-12 text-center">{item.quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => updateQuantity(item.productId, 1)} className="h-10 w-10">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-right min-w-[120px]">
                    <p className="text-lg font-bold text-gray-900">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    aria-label={`Xóa ${item.product.name}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Tóm tắt đơn hàng</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-semibold text-green-600">Tính ở bước sau</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold text-gray-900">Tổng tạm tính:</span>
                      <span className="font-bold text-blue-600 text-xl">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold mb-3">
                    Tiến hành thanh toán
                  </Button>
                </Link>

                <Link href="/products">
                  <Button variant="outline" className="w-full py-6 text-base bg-transparent">
                    Tiếp tục mua sắm
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
