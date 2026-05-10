"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const navItems = [
    { href: "/", label: "Trang chủ" },
    { href: "/skills", label: "Học kỹ năng" },
    { href: "/news", label: "Tin tức" },
    { href: "/roadmap", label: "Khám phá lộ trình" },
    { href: "/products", label: "Sản phẩm" },
    { href: "/pools", label: "Tìm hồ bơi" },
  ];

  return (
    <header className="w-full bg-white overflow-visible relative border-b shadow-sm">
      <div className="bg-blue-600 text-white py-3 px-4 shadow-md rounded-b-2xl">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-medium">
            Cơ hội sở hữu trang thiết bị bơi lội với ưu đãi tốt nhất{" "}
            <Link href="/products" className="underline hover:no-underline">
              Khám phá ngay
            </Link>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/LOGO/FLOATY-MIN.png"
            alt="Floaty Logo"
            width={112}
            height={40}
            className="w-28 h-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors ${
                  isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="rounded-full p-2 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
            aria-label="Giỏ hàng"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {loading ? null : user ? (
            <Menu as="div" className="relative">
              <MenuButton className="flex cursor-pointer items-center gap-2 transition-colors hover:text-blue-600">
                <Image
                  src={user.avatar || "/placeholder-user.jpg"}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="hidden sm:inline max-w-28 truncate">{user.name}</span>
              </MenuButton>

              <MenuItems className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50 border">
                {[
                  { label: "Xem profile", href: "/profile" },
                  { label: "Giỏ hàng", href: "/cart" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm transition-colors hover:bg-blue-50 hover:text-blue-600"
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-blue-50 hover:text-blue-600"
                >
                  Đăng xuất
                </button>
              </MenuItems>
            </Menu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Đăng nhập
              </Link>
              <Link href="/signup" className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
