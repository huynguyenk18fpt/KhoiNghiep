"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Tag } from "lucide-react";
import { formatPrice } from "@/lib/data/products";
import type { CartItem } from "@/lib/local-store";
import { hydrateCart } from "@/lib/local-store";

type OrderSummaryProps = {
  cartItems: CartItem[];
  shippingMethod: "standard" | "express";
  couponCode: string;
  appliedCoupon: string | null;
  isLoading: boolean;
  error?: string | null;
  onShippingChange: (value: "standard" | "express") => void;
  onCouponChange: (value: string) => void;
  onApplyCoupon: () => void;
  onPlaceOrder: () => void;
};

export default function OrderSummary({
  cartItems,
  shippingMethod,
  couponCode,
  appliedCoupon,
  isLoading,
  error,
  onShippingChange,
  onCouponChange,
  onApplyCoupon,
  onPlaceOrder,
}: OrderSummaryProps) {
  const hydratedItems = hydrateCart(cartItems);
  const subtotal = hydratedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = shippingMethod === "express" ? 50000 : 30000;
  const discount = appliedCoupon ? 20000 : 0;
  const total = subtotal + shippingFee - discount;

  if (hydratedItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 text-center">
        <p className="text-gray-600 mb-4">Giỏ hàng của bạn đang trống.</p>
        <Link href="/products">
          <Button className="bg-blue-600 hover:bg-blue-700">Về trang sản phẩm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 lg:sticky lg:top-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

      <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
        {hydratedItems.map((item) => (
          <div key={item.productId} className="flex gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <Image src={item.product.image} alt={item.product.name} fill sizes="64px" className="object-contain p-1" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">x {item.quantity}</span>
                <span className="text-sm font-medium text-gray-900">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 pb-6 border-b border-gray-200">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Phương thức vận chuyển</Label>
        <RadioGroup value={shippingMethod} onValueChange={(value) => onShippingChange(value as "standard" | "express")}>
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard" className="text-sm cursor-pointer">
                Tiêu chuẩn (3-5 ngày)
              </Label>
            </div>
            <span className="text-sm font-medium text-gray-900">{formatPrice(30000)}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors mt-2">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="express" id="express" />
              <Label htmlFor="express" className="text-sm cursor-pointer">
                Nhanh (1-2 ngày)
              </Label>
            </div>
            <span className="text-sm font-medium text-gray-900">{formatPrice(50000)}</span>
          </div>
        </RadioGroup>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-200">
        <Label htmlFor="coupon" className="text-sm font-medium text-gray-700 mb-3 block">
          Mã giảm giá demo
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="coupon"
              type="text"
              placeholder="Nhập mã bất kỳ"
              value={couponCode}
              onChange={(e) => onCouponChange(e.target.value)}
              className="pl-10"
              disabled={Boolean(appliedCoupon)}
            />
          </div>
          <Button type="button" variant="outline" onClick={onApplyCoupon} disabled={!couponCode.trim() || Boolean(appliedCoupon)}>
            Áp dụng
          </Button>
        </div>
        {appliedCoupon && <p className="mt-2 text-sm text-green-600">Mã {appliedCoupon} đã được áp dụng.</p>}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tổng phụ</span>
          <span className="text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="text-gray-900">{formatPrice(shippingFee)}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Giảm giá</span>
            <span className="text-green-600">-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-lg font-semibold pt-3 border-t border-gray-200">
          <span className="text-gray-900">Tổng cộng</span>
          <span className="text-blue-600">{formatPrice(total)}</span>
        </div>
      </div>

      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="space-y-3">
        <Button
          onClick={onPlaceOrder}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 text-base"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Đặt hàng demo"
          )}
        </Button>
        <Link href="/products" className="block">
          <Button variant="outline" className="w-full bg-transparent">
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>

      <p className="mt-4 text-xs text-center text-gray-500">Đây là đơn hàng demo FE-only, chưa xử lý thanh toán thật.</p>
    </div>
  );
}
