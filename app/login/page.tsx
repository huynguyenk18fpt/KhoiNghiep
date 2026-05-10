"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

type GoogleCredentialPayload = {
  sub?: string;
  name?: string;
  email?: string;
  picture?: string;
};

function decodeGoogleCredential(credential: string): GoogleCredentialPayload {
  const payload = credential.split(".")[1];
  if (!payload) throw new Error("Google credential không hợp lệ.");

  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    Array.from(window.atob(base64))
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join(""),
  );

  return JSON.parse(json) as GoogleCredentialPayload;
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const rawGoogleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const googleClientId = rawGoogleClientId && rawGoogleClientId !== "your_google_client_id_here" ? rawGoogleClientId : "";
  const { login, loginWithGoogle } = useAuth();

  const handleGoogleCredential = useCallback(
    async (response: GoogleCredentialResponse) => {
      setError(null);

      if (!response.credential) {
        setError("Google không trả về credential hợp lệ.");
        return;
      }

      setSubmitting(true);
      try {
        const profile = decodeGoogleCredential(response.credential);
        if (!profile.email) {
          throw new Error("Google không trả về email hợp lệ.");
        }

        await loginWithGoogle({
          id: profile.sub,
          name: profile.name || profile.email,
          email: profile.email,
          avatar: profile.picture,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đăng nhập Google thất bại.");
      } finally {
        setSubmitting(false);
      }
    },
    [loginWithGoogle],
  );

  const initializeGoogleButton = useCallback(() => {
    if (!googleClientId || !googleButtonRef.current || !window.google?.accounts?.id) return;

    const buttonWidth = Math.min(400, googleButtonRef.current.clientWidth || 400);

    googleButtonRef.current.innerHTML = "";
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredential,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      width: buttonWidth,
      logo_alignment: "left",
    });
  }, [googleClientId, handleGoogleCredential]);

  useEffect(() => {
    initializeGoogleButton();
  }, [initializeGoogleButton]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {googleClientId ? (
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={initializeGoogleButton} />
      ) : null}
      <Header />

      <main className="flex-1 flex">
        <div className="hidden lg:flex lg:w-1/2 bg-gray-50 p-12 items-center justify-center">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Đăng nhập trải nghiệm tư vấn từ chuyên gia
            </h2>
            <blockquote className="text-gray-700 text-lg leading-relaxed mb-8">
              Trong phiên bản FE-only, tài khoản được lưu cục bộ trên trình duyệt để phục vụ demo.
              Bạn có thể đăng ký một tài khoản mới rồi đăng nhập lại sau khi tải lại trang.
            </blockquote>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
              <p className="text-gray-600">Chào bạn! Vui lòng đăng nhập để truy cập tài khoản demo.</p>
            </div>

            <div className="mb-6 space-y-4">
              {googleClientId ? (
                <div className="flex justify-center">
                  <div
                    ref={googleButtonRef}
                    className={`w-full max-w-sm ${submitting ? "pointer-events-none opacity-60" : ""}`}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Button type="button" variant="outline" className="w-full" disabled>
                    Đăng nhập với Google
                  </Button>
                  <p className="text-center text-sm text-amber-700">
                    Thiếu NEXT_PUBLIC_GOOGLE_CLIENT_ID trong .env.local.
                  </p>
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Hoặc</span>
                </div>
              </div>
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
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={submitting}>
                {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              <div className="text-center text-sm text-gray-600 mt-2">
                Chưa có tài khoản?{" "}
                <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                  Đăng ký
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải...</div>}>
      <LoginForm />
    </Suspense>
  );
}
