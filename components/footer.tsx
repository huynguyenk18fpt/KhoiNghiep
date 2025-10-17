"use client";

import Link from "next/link";
import Image from "next/image";
import { SiFacebook, SiX, SiLinkedin } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t pt-5 pb-6 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Side - Logo + Description */}
          <div>
            <Link href="/" className="inline-block">
              <div className="relative w-[375px] h-[250px]">
                <Image
                  src="/images/LOGO/FLOATY-FULL.png"
                  alt="Floaty Logo"
                  fill
                  priority
                  className="object-fit-cover"
                />
              </div>
            </Link>
            <p className="text-gray-600 mt-4 text-lg leading-relaxed max-w-sm">
              Chủ động trong mọi tình huống đuối nước
            </p>
            <div className="mt-6 space-y-2 text-lg text-gray-600">
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span>nguyenhhce181330@fpt.edu.vn</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>+84 0973124868</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Thành phố Cần Thơ, Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Right Side - 3 Columns */}
          <div className="grid grid-cols-3 gap-8">
            {/* Navigation */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                Trang chủ
              </h3>
              <ul className="space-y-2 text-base text-gray-600">
                <li>
                  <Link href="/skills" className="hover:text-red-500">
                    Học kỹ năng
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="hover:text-red-500">
                    Tin tức
                  </Link>
                </li>
                <li>
                  <Link href="/ai" className="hover:text-red-500">
                    AI
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-red-500">
                    Sản phẩm
                  </Link>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                Sản phẩm
              </h3>
              <ul className="space-y-2 text-base text-gray-600">
                <li>
                  <Link
                    href="/products/life-buoy"
                    className="hover:text-red-500"
                  >
                    Phao bơi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/swimwear"
                    className="hover:text-red-500"
                  >
                    Áo bơi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/accessories"
                    className="hover:text-red-500"
                  >
                    Quần bơi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                Social Profiles
              </h3>
              <div className="flex gap-4">
                <Link
                  href="https://www.facebook.com/profile.php?id=61581006342451"
                  className="p-2 bg-white border rounded-lg shadow-sm text-gray-600 hover:text-blue-500 hover:shadow-md transition"
                >
                  <SiFacebook size={20} />
                </Link>
                <Link
                  href="#"
                  className="p-2 bg-white border rounded-lg shadow-sm text-gray-600 hover:text-blue-500 hover:shadow-md transition"
                >
                  <SiX size={20} />
                </Link>
                <Link
                  href="#"
                  className="p-2 bg-white border rounded-lg shadow-sm text-gray-600 hover:text-blue-500 hover:shadow-md transition"
                >
                  <SiLinkedin size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-12 pt-6 text-center text-base text-gray-500">
          © 2025 Floaty. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
