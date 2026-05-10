import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiFacebook } from "react-icons/si";

const navigationLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/skills", label: "Học kỹ năng" },
  { href: "/news", label: "Tin tức" },
  { href: "/roadmap", label: "Khám phá lộ trình" },
  { href: "/products", label: "Sản phẩm" },
  { href: "/pools", label: "Tìm hồ bơi" },
];

const productLinks = [
  { href: "/products", label: "Phao bơi" },
  { href: "/products", label: "Kính bơi" },
  { href: "/products", label: "Mũ bơi" },
  { href: "/products", label: "Combo luyện tập" },
];

export default function Footer() {
  return (
    <footer className="border-t border-sky-700 bg-sky-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/95 p-1.5 shadow-sm">
                <Image
                  src="/images/LOGO/FLOATY-MIN.png"
                  alt="Floaty"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="text-2xl font-bold tracking-tight text-white">Floaty</span>
            </Link>

            <p className="mt-4 text-base leading-7 text-sky-100">
              Chủ động trong mọi tình huống đuối nước với kiến thức, lộ trình
              luyện tập và thiết bị bơi an toàn cho gia đình.
            </p>

            <div className="mt-6 space-y-3 text-sm text-sky-100">
              <Link
                href="mailto:nguyenhhce181330@fpt.edu.vn"
                className="flex items-center gap-3 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-sky-200" aria-hidden="true" />
                <span>nguyenhhce181330@fpt.edu.vn</span>
              </Link>
              <Link
                href="tel:+84973124868"
                className="flex items-center gap-3 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0 text-sky-200" aria-hidden="true" />
                <span>+84 973 124 868</span>
              </Link>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-sky-200" aria-hidden="true" />
                <span>Thành phố Cần Thơ, Việt Nam</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                Điều hướng
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-sky-100">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                Sản phẩm
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-sky-100">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                Kết nối
              </h3>
              <div className="mt-4 flex gap-3">
                <Link
                  href="https://www.facebook.com/profile.php?id=61581006342451"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-sky-600 bg-sky-700 text-white shadow-sm transition hover:border-sky-300 hover:bg-sky-600 hover:shadow-md"
                >
                  <SiFacebook size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-sky-700 pt-6 text-sm text-sky-100 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Floaty. All rights reserved.</p>
          <p>Phòng chống đuối nước cho trẻ em và phụ huynh.</p>
        </div>
      </div>
    </footer>
  );
}
