"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Wallet, QrCode } from "lucide-react"

export default function PaymentMethods() {
  const [paymentMethod, setPaymentMethod] = useState("cod")

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Phương thức thanh toán</h3>

      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
        {/* COD */}
        <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors mb-3">
          <RadioGroupItem value="cod" id="cod" className="mt-1" />
          <div className="flex-1">
            <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
              <Wallet className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</span>
            </Label>
            <p className="text-sm text-gray-500 mt-1 ml-7">Thanh toán bằng tiền mặt khi nhận hàng</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors mb-3">
          <RadioGroupItem value="qr" id="qr" className="mt-1" />
          <div className="flex-1">
            <Label htmlFor="qr" className="flex items-center gap-2 cursor-pointer">
              <QrCode className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Chuyển khoản QR</span>
            </Label>
            <p className="text-sm text-gray-500 mt-1 ml-7">Quét mã QR để thanh toán qua ứng dụng ngân hàng</p>
          </div>
        </div>

        {/* Card/ATM */}
        <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
          <RadioGroupItem value="card" id="card" className="mt-1" />
          <div className="flex-1">
            <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Thẻ ATM/Visa/Mastercard</span>
            </Label>
            <p className="text-sm text-gray-500 mt-1 ml-7">Thanh toán bằng thẻ ngân hàng nội địa hoặc quốc tế</p>
          </div>
        </div>
      </RadioGroup>

      {/* Card Form - Show when card is selected */}
      {paymentMethod === "card" && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            Tính năng thanh toán bằng thẻ sẽ được cập nhật trong phiên bản tiếp theo.
          </p>
        </div>
      )}
    </div>
  )
}
