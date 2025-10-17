"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import PaymentMethods from "./payment-methods"

interface FormData {
  fullName: string
  phone: string
  address: string
  saveAddress: boolean
}

interface FormErrors {
  fullName?: string
  phone?: string
  address?: string
}

export default function CheckoutForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    address: "",
    saveAddress: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Validation functions
  const validateFullName = (name: string): string | undefined => {
    if (!name.trim()) return "Vui lòng nhập tên đầy đủ"
    if (name.length < 2 || name.length > 60) return "Tên phải từ 2-60 ký tự"
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(name)) return "Tên chỉ được chứa chữ cái và khoảng trắng"
    return undefined
  }

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return "Vui lòng nhập số điện thoại"
    const phoneRegex = /^(\+84|0)([3|5|7|8|9])\d{8}$/
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return "Số điện thoại không hợp lệ"
    }
    return undefined
  }

  const validateAddress = (address: string): string | undefined => {
    if (!address.trim()) return "Địa chỉ không được để trống"
    if (address.length < 10 || address.length > 200) {
      return "Địa chỉ phải từ 10-200 ký tự"
    }
    return undefined
  }

  // Handle input change with validation
  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Validate on change if field was touched
    if (touched[field] && typeof value === "string") {
      let error: string | undefined
      if (field === "fullName") error = validateFullName(value)
      if (field === "phone") error = validatePhone(value)
      if (field === "address") error = validateAddress(value)

      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))

    // Validate on blur
    let error: string | undefined
    if (field === "fullName") error = validateFullName(formData.fullName)
    if (field === "phone") error = validatePhone(formData.phone)
    if (field === "address") error = validateAddress(formData.address)

    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  // Format phone number display
  const formatPhoneDisplay = (phone: string): string => {
    const cleaned = phone.replace(/\s/g, "")
    if (cleaned.startsWith("+84")) {
      return cleaned.replace(/(\+84)(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4")
    }
    if (cleaned.startsWith("0")) {
      return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")
    }
    return phone
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin người nhận</h2>

      <form className="space-y-6">
        {/* Full Name */}
        <div>
          <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-2 block">
            Họ và tên <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Ví dụ: Nguyễn Văn A"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            onBlur={() => handleBlur("fullName")}
            className={`${errors.fullName && touched.fullName ? "border-red-300 focus-visible:ring-red-500" : ""}`}
            aria-label="Họ và tên"
            aria-invalid={!!errors.fullName && touched.fullName}
            aria-describedby={errors.fullName && touched.fullName ? "fullName-error" : undefined}
          />
          {errors.fullName && touched.fullName && (
            <p id="fullName-error" className="mt-2 text-sm text-red-600" role="alert">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
            Số điện thoại <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Ví dụ: (+84) 912 345 678"
            value={formatPhoneDisplay(formData.phone)}
            onChange={(e) => handleChange("phone", e.target.value.replace(/\s/g, ""))}
            onBlur={() => handleBlur("phone")}
            className={`${errors.phone && touched.phone ? "border-red-300 focus-visible:ring-red-500" : ""}`}
            aria-label="Số điện thoại"
            aria-invalid={!!errors.phone && touched.phone}
            aria-describedby={errors.phone && touched.phone ? "phone-error" : undefined}
          />
          {errors.phone && touched.phone && (
            <p id="phone-error" className="mt-2 text-sm text-red-600" role="alert">
              {errors.phone}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-500">Chấp nhận định dạng: +84 hoặc 0...</p>
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
            Địa chỉ nhận hàng <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="address"
            rows={3}
            placeholder="Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            onBlur={() => handleBlur("address")}
            className={`resize-none ${errors.address && touched.address ? "border-red-300 focus-visible:ring-red-500" : ""}`}
            aria-label="Địa chỉ nhận hàng"
            aria-invalid={!!errors.address && touched.address}
            aria-describedby={errors.address && touched.address ? "address-error" : undefined}
          />
          {errors.address && touched.address && (
            <p id="address-error" className="mt-2 text-sm text-red-600" role="alert">
              {errors.address}
            </p>
          )}
        </div>

        {/* Save Address Checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="saveAddress"
            checked={formData.saveAddress}
            onCheckedChange={(checked) => handleChange("saveAddress", checked as boolean)}
            aria-label="Lưu địa chỉ này cho lần sau"
          />
          <Label htmlFor="saveAddress" className="text-sm text-gray-700 cursor-pointer">
            Lưu địa chỉ này cho lần sau
          </Label>
        </div>

        {/* Payment Methods */}
        <div className="pt-6 border-t border-gray-200">
          <PaymentMethods />
        </div>
      </form>
    </div>
  )
}
