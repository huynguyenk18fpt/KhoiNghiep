"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CheckoutForm from "@/components/checkout/checkout-form";
import OrderSummary from "@/components/checkout/order-summary";
import { ChevronRight } from "lucide-react";
import { cartStore, orderStore, type CartItem, type CheckoutInfo } from "@/lib/local-store";

const defaultCheckoutInfo: CheckoutInfo = {
  fullName: "",
  phone: "",
  address: "",
  saveAddress: false,
  paymentMethod: "cod",
  shippingMethod: "standard",
  couponCode: "",
};

function validateCheckout(info: CheckoutInfo) {
  const errors: Partial<Record<keyof CheckoutInfo, string>> = {};
  if (!info.fullName.trim()) errors.fullName = "Vui lòng nhập họ và tên.";
  if (info.fullName.trim() && (info.fullName.trim().length < 2 || info.fullName.trim().length > 60)) {
    errors.fullName = "Tên phải từ 2-60 ký tự.";
  }

  const cleanedPhone = info.phone.replace(/\s/g, "");
  if (!cleanedPhone) errors.phone = "Vui lòng nhập số điện thoại.";
  if (cleanedPhone && !/^(\+84|0)(3|5|7|8|9)\d{8}$/.test(cleanedPhone)) {
    errors.phone = "Số điện thoại không hợp lệ.";
  }

  if (!info.address.trim()) errors.address = "Địa chỉ không được để trống.";
  if (info.address.trim() && (info.address.trim().length < 10 || info.address.trim().length > 200)) {
    errors.address = "Địa chỉ phải từ 10-200 ký tự.";
  }

  return errors;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo>(defaultCheckoutInfo);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutInfo, string>>>({});
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([cartStore.getItems(), orderStore.getCheckoutDraft()])
      .then(([items, draft]) => {
        setCartItems(items);
        setCheckoutInfo({ ...defaultCheckoutInfo, ...draft });
        setCouponCode(draft.couponCode || "");
      })
      .catch(() => {
        setSubmitError("Không thể tải dữ liệu checkout từ MongoDB.");
      });
  }, []);

  const updateCheckoutInfo = (nextInfo: CheckoutInfo) => {
    setCheckoutInfo(nextInfo);
    void orderStore.setCheckoutDraft(nextInfo);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setAppliedCoupon(couponCode.trim().toUpperCase());
  };

  const handlePlaceOrder = async () => {
    setSubmitError(null);
    const nextInfo = {
      ...checkoutInfo,
      shippingMethod: checkoutInfo.shippingMethod,
      couponCode: appliedCoupon || undefined,
    };
    const nextErrors = validateCheckout(nextInfo);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitError("Vui lòng kiểm tra lại thông tin nhận hàng.");
      return;
    }

    setIsLoading(true);
    try {
      const shippingFee = nextInfo.shippingMethod === "express" ? 50000 : 30000;
      const discount = appliedCoupon ? 20000 : 0;
      await orderStore.createOrder(nextInfo, shippingFee, discount);
      router.push("/order-confirmation");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Không thể tạo đơn hàng demo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/cart" className="text-gray-600 hover:text-blue-600 transition-colors">
              Giỏ hàng
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Thanh toán</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán demo</h1>
          <p className="text-gray-600 mb-8">Đơn hàng được lưu cục bộ trên trình duyệt, không gửi đến backend.</p>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CheckoutForm value={checkoutInfo} errors={errors} onChange={updateCheckoutInfo} />
            </div>

            <div className="lg:col-span-1">
              <OrderSummary
                cartItems={cartItems}
                shippingMethod={checkoutInfo.shippingMethod}
                couponCode={couponCode}
                appliedCoupon={appliedCoupon}
                isLoading={isLoading}
                error={submitError}
                onShippingChange={(shippingMethod) => updateCheckoutInfo({ ...checkoutInfo, shippingMethod })}
                onCouponChange={setCouponCode}
                onApplyCoupon={handleApplyCoupon}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
