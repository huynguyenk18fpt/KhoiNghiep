import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Package, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export default function OrderConfirmationPage() {
  // Mock order data - in real app, get from URL params or API
  const orderNumber = "FLT" + Math.random().toString(36).substr(2, 9).toUpperCase()
  const estimatedDelivery = "3-5 ngày làm việc"

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Đặt hàng thành công!</h1>
            <p className="text-gray-600 mb-8">
              Cảm ơn bạn đã đặt hàng. Chúng tôi đã nhận được đơn hàng của bạn và sẽ xử lý trong thời gian sớm nhất.
            </p>

            {/* Order Number */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Mã đơn hàng</p>
              <p className="text-2xl font-bold text-blue-600">{orderNumber}</p>
            </div>

            {/* Order Details */}
            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Package className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Trạng thái đơn hàng</p>
                  <p className="text-sm text-gray-600 mt-1">Đang xử lý</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Thời gian giao hàng dự kiến</p>
                  <p className="text-sm text-gray-600 mt-1">{estimatedDelivery}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Địa chỉ giao hàng</p>
                  <p className="text-sm text-gray-600 mt-1">Thông tin địa chỉ sẽ được hiển thị trong email xác nhận</p>
                </div>
              </div>
            </div>

            {/* Email Notification */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-yellow-800">
                📧 Chúng tôi đã gửi email xác nhận đơn hàng đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư đến
                hoặc thư rác.
              </p>
            </div>

            {/* Action Buttons */}
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
  )
}
