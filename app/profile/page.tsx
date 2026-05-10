"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, loading, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/placeholder-user.jpg");
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setAvatarUrl(user.avatar || "/placeholder-user.jpg");
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user) return;
    try {
      await updateProfile({ ...user, name: name.trim() || user.name, avatar: avatarUrl });
      setIsEditing(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch {
      setSaved(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(String(reader.result));
      setIsEditing(true);
    };
    reader.readAsDataURL(file);
  };

  if (!loading && !user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Bạn chưa đăng nhập</h1>
            <p className="text-gray-600 mb-6">Hãy đăng nhập hoặc tạo tài khoản demo để xem hồ sơ.</p>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700">Đăng nhập</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Thông tin cá nhân</h1>
          <p className="text-sm text-gray-500 mb-8">Dữ liệu hồ sơ được lưu cục bộ trên trình duyệt cho bản demo FE-only.</p>

          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-blue-500">
                <Image src={avatarUrl} alt="Avatar" width={128} height={128} className="w-full h-full object-cover" />
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
              >
                <Camera className="w-5 h-5" />
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-3">Nhấn vào biểu tượng camera để thay đổi ảnh đại diện.</p>
          </div>

          <div className="mb-6">
            <Label htmlFor="name" className="text-base font-semibold mb-2 block">
              Tên đầy đủ
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsEditing(true);
              }}
              className="text-base"
              placeholder="Nhập tên của bạn"
            />
          </div>

          <div className="mb-8">
            <Label htmlFor="email" className="text-base font-semibold mb-2 block">
              Email
            </Label>
            <Input id="email" type="email" value={user?.email || ""} disabled className="text-base bg-gray-100 cursor-not-allowed" />
            <p className="text-sm text-gray-500 mt-2">Email không thể thay đổi trong bản demo.</p>
          </div>

          {saved && <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">Đã lưu thay đổi hồ sơ.</p>}

          <div className="flex gap-4">
            <Button
              onClick={handleSaveChanges}
              disabled={!isEditing}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold"
            >
              Lưu thay đổi
            </Button>
            <Button
              onClick={() => {
                setName(user?.name || "");
                setAvatarUrl(user?.avatar || "/placeholder-user.jpg");
                setIsEditing(false);
              }}
              variant="outline"
              className="flex-1 py-6 text-base font-semibold"
            >
              Hủy
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
