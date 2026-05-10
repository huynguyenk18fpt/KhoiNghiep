"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import PaymentMethods from "./payment-methods";
import type { CheckoutInfo } from "@/lib/local-store";

type CheckoutFormProps = {
  value: CheckoutInfo;
  errors: Partial<Record<keyof CheckoutInfo, string>>;
  onChange: (value: CheckoutInfo) => void;
};

export default function CheckoutForm({ value, errors, onChange }: CheckoutFormProps) {
  const update = <K extends keyof CheckoutInfo>(field: K, nextValue: CheckoutInfo[K]) => {
    onChange({ ...value, [field]: nextValue });
  };

  const formatPhoneDisplay = (phone: string): string => {
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.startsWith("+84")) {
      return cleaned.replace(/(\+84)(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4");
    }
    if (cleaned.startsWith("0")) {
      return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
    }
    return phone;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin người nhận</h2>

      <form className="space-y-6">
        <div>
          <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-2 block">
            Họ và tên <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Ví dụ: Nguyễn Văn A"
            value={value.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className={errors.fullName ? "border-red-300 focus-visible:ring-red-500" : ""}
            aria-invalid={Boolean(errors.fullName)}
          />
          {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>}
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
            Số điện thoại <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Ví dụ: 0912 345 678"
            value={formatPhoneDisplay(value.phone)}
            onChange={(e) => update("phone", e.target.value.replace(/\s/g, ""))}
            className={errors.phone ? "border-red-300 focus-visible:ring-red-500" : ""}
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
          <p className="mt-2 text-sm text-gray-500">Chấp nhận định dạng: +84 hoặc số bắt đầu bằng 0.</p>
        </div>

        <div>
          <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
            Địa chỉ nhận hàng <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="address"
            rows={3}
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
            value={value.address}
            onChange={(e) => update("address", e.target.value)}
            className={`resize-none ${errors.address ? "border-red-300 focus-visible:ring-red-500" : ""}`}
            aria-invalid={Boolean(errors.address)}
          />
          {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="saveAddress" checked={value.saveAddress} onCheckedChange={(checked) => update("saveAddress", Boolean(checked))} />
          <Label htmlFor="saveAddress" className="text-sm text-gray-700 cursor-pointer">
            Lưu địa chỉ này cho lần sau
          </Label>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <PaymentMethods value={value.paymentMethod} onChange={(paymentMethod) => update("paymentMethod", paymentMethod)} />
        </div>
      </form>
    </div>
  );
}
