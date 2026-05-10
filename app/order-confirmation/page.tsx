"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, MapPin, Package } from "lucide-react";
import { formatPrice } from "@/lib/data/products";
import { orderStore, type DemoOrder } from "@/lib/local-store";

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<DemoOrder | null>(null);

  useEffect(() => {
    orderStore.getLastOrder().then(setOrder).catch(() => setOrder(null));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">Đặt hàng demo thành công!</h1>
            <p className="text-gray-600 mb-8">
              Cảm ơn bạn. Đơn hàng này chỉ được lưu trên trình duyệt để phục vụ bản FE-only MVP.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Mã đơn hàng</p>
              <p className="text-2xl font-bold text-blue-600">{order?.id || "Chưa có đơn gần nhất"}</p>
            </div>

            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Package className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Trạng thái đơn hàng</p>
                  <p className="text-sm text-gray-600 mt-1">Đang xử lý demo</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Thời gian giao hàng dự kiến</p>
                  <p className="text-sm text-gray-600 mt-1">3-5 ngày làm việc</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Địa chỉ giao hàng</p>
                  <p className="text-sm text-gray-600 mt-1">{order?.customer.address || "Chưa có thông tin địa chỉ."}</p>
                </div>
              </div>
            </div>

            {order && (
              <div className="border rounded-xl p-4 mb-8 text-left">
                <p className="font-semibold text-gray-900 mb-3">Sản phẩm</p>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex justify-between gap-3 text-sm">
                      <span className="text-gray-700">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t pt-3 flex justify-between font-semibold">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">{formatPrice(order.total)}</span>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-yellow-800">Không có email xác nhận hay thanh toán thật trong phiên bản FE-only.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/products">
                <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">Tiếp tục mua sắm</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                  Về trang chủ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
