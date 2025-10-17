"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa"; // Thêm biểu tượng Google
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/register", { name, email, password });
      await login(res.data.token);
      router.push("/"); // Điều hướng về trang chủ sau khi đăng ký thành công
    } catch (err: any) {
      alert(err.response?.data?.error || "Đăng ký thất bại");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-gray-900">Đăng ký trải nghiệm tư vấn từ chuyên gia</h1>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="fullname" className="text-sm font-medium text-gray-700">Tên đầy đủ</Label>
                  <Input id="fullname" type="text" placeholder="Tên đầy đủ" value={name} onChange={e => setName(e.target.value)} required />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <Input id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Mật khẩu</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
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

                <div className="flex items-start gap-2">
                  <Checkbox id="terms" className="mt-1" />
                  <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    Tôi đồng ý với <Link href="/terms" className="text-blue-600 hover:underline">Điều khoản sử dụng</Link> và <Link href="/privacy" className="text-blue-600 hover:underline">Chính sách bảo mật</Link>
                  </Label>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Đăng ký</Button>

                <div className="text-center text-sm text-gray-600">Hoặc</div>

                <Button
                  variant="outline"
                  className="w-full flex items-center gap-3 bg-transparent"
                  onClick={handleGoogleSignup}
                >
                  <FaGoogle className="text-lg" /> Đăng ký bằng Google
                </Button>

                <div className="text-center text-sm text-gray-600 mt-2">
                  Đã có tài khoản?{" "}
                  <Link href="/login" className="text-blue-600 hover:underline font-medium">Đăng nhập →</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
