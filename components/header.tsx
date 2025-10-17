"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
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

  if (loading) return null; // hoặc spinner

  return (
    <header className="w-full bg-white overflow-visible relative border-b shadow-sm">
      {/* Top Banner */}
      <div className="bg-blue-600 text-white py-3 px-4 shadow-md rounded-b-2xl">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-medium">
            Cơ hội sở hữu những trang thiết bị bơi lội với ưu đãi tốt nhất ⭐{" "}
            <Link href="/products" className="underline hover:no-underline">
              Khám phá ngay →
            </Link>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/LOGO/FLOATY-MIN.png"
            alt="Floaty Logo"
            width={32}
            height={32}
            className="w-28 object-contain"
            priority
          />
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
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

        {/* Auth */}
        <div className="flex items-center gap-3">
          {/* Chỉ hiển thị phần người dùng đã đăng nhập */}
          {user ? (
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center gap-2 cursor-pointer">
                <Image
                  src={user.avatar || "/images/default-avatar.png"}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span>{user.name}</span>
              </MenuButton>

              {/* Menu Items */}
              <MenuItems className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50">
                {[{ label: "Xem profile", href: "/profile" }, { label: "Giỏ hàng", href: "/cart" }]
                  .map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {item.label}
                    </Link>
                  ))}
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </MenuItems>
            </Menu>
          ) : (
            // Không hiển thị nút Đăng ký và Đăng nhập nữa
            <></>
          )}
        </div>
      </div>
    </header>
  );
}
