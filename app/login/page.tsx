"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Khi Google OAuth redirect về frontend với ?token=xxxx
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      login(token);
      router.push("/");
    }
  }, [searchParams, login, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", { email, password });
      await login(res.data.token);
      router.push("/"); 
    } catch (err: any) {
      alert(err.response?.data?.error || "Login thất bại");
    }
  };

  const handleGoogleLogin = () => {
    // Backend xử lý OAuth, sau khi thành công sẽ redirect về: http://localhost:3000/login?token=xxx
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex">
        {/* Bên trái (desktop) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-50 p-12 items-center justify-center">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Đăng nhập trải nghiệm từ tư vấn chuyên gia
            </h2>
            <blockquote className="text-gray-700 text-lg leading-relaxed mb-8">
              "Trong suốt hơn 15 năm giảng dạy, tôi nhận ra rằng kỹ năng phòng chống đuối nước không chỉ là học bơi, mà
              còn là học cách bình tĩnh, xử lý tình huống và tự bảo vệ mình. Chương trình của Floaty được thiết kế đặc
              biệt để phù hợp với cả trẻ nhỏ lẫn người chưa từng xuống nước, đảm bảo an toàn ngay từ buổi học đầu tiên."
            </blockquote>
          </div>
        </div>

        {/* Bên phải (form) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
              <p className="text-gray-600">Chào bạn! Vui lòng đăng nhập để truy cập tài khoản của bạn</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    className="pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Đăng nhập
              </Button>

              <div className="text-center text-sm text-gray-600">Hoặc</div>

              {/* Đăng nhập bằng Google */}
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-3 bg-transparent"
                onClick={handleGoogleLogin}
              >
                <FaGoogle className="text-lg" /> Đăng nhập bằng Google
              </Button>

              <div className="text-center text-sm text-gray-600 mt-2">
                Chưa có tài khoản?{" "}
                <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                  Đăng ký →
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
