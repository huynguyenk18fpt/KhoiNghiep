"use client"

import type React from "react"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
  const [name, setName] = useState("Nguyễn Văn A")
  const [email] = useState("nguyenvana@example.com")
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg?height=120&width=120")
  const [isEditing, setIsEditing] = useState(false)

  const handleSaveChanges = () => {
    // TODO: Implement save changes logic
    console.log("[v0] Saving changes:", { name, avatarUrl })
    setIsEditing(false)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Thông tin cá nhân</h1>

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-blue-500">
                <Image
                  src={avatarUrl || "/placeholder.svg"}
                  alt="Avatar"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
              >
                <Camera className="w-5 h-5" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-3">Nhấp vào biểu tượng camera để thay đổi ảnh đại diện</p>
          </div>

          {/* Name Field */}
          <div className="mb-6">
            <Label htmlFor="name" className="text-base font-semibold mb-2 block">
              Tên đầy đủ
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setIsEditing(true)
              }}
              className="text-base"
              placeholder="Nhập tên của bạn"
            />
          </div>

          {/* Email Field (Read-only) */}
          <div className="mb-8">
            <Label htmlFor="email" className="text-base font-semibold mb-2 block">
              Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="text-base bg-gray-100 cursor-not-allowed"
              />
              <p className="text-sm text-gray-500 mt-2">Email không thể thay đổi</p>
            </div>
          </div>

          {/* Action Buttons */}
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
                setName("Nguyễn Văn A")
                setAvatarUrl("/placeholder.svg?height=120&width=120")
                setIsEditing(false)
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
  )
}
