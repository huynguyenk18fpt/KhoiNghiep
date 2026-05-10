"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export type RoadmapFormValue = {
  age: string;
  height: string;
  weight: string;
  level: "beginner" | "intermediate" | "advanced";
  goal: "suc-khoe" | "cuu-ho" | "the-thao";
  frequency: "2" | "3" | "4";
  healthHistory: string[];
};

export default function RoadmapForm({ onSubmit }: { onSubmit: (data: RoadmapFormValue) => void }) {
  const [formData, setFormData] = useState<RoadmapFormValue>({
    age: "",
    height: "",
    weight: "",
    level: "beginner",
    goal: "suc-khoe",
    frequency: "2",
    healthHistory: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const healthOptions = [
    { id: "asthma", label: "Hen suyễn" },
    { id: "heart", label: "Tim mạch" },
    { id: "bp", label: "Huyết áp" },
    { id: "joint", label: "Khớp" },
    { id: "other", label: "Khác" },
  ];

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.age || Number(formData.age) < 6 || Number(formData.age) > 100) nextErrors.age = "Tuổi không hợp lệ, tối thiểu là 6.";
    if (!formData.height || Number(formData.height) < 100) nextErrors.height = "Chiều cao tối thiểu là 100cm.";
    if (!formData.weight || Number(formData.weight) < 20) nextErrors.weight = "Cân nặng tối thiểu là 20kg.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const toggleHealth = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      healthHistory: prev.healthHistory.includes(id)
        ? prev.healthHistory.filter((item) => item !== id)
        : [...prev.healthHistory, id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto rounded-2xl p-8 border bg-card">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-card-foreground">Tuổi</label>
            <input
              type="number"
              min={6}
              max={100}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            />
            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-card-foreground">Chiều cao (cm)</label>
            <input
              type="number"
              min={100}
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            />
            {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-card-foreground">Cân nặng (kg)</label>
            <input
              type="number"
              min={20}
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            />
            {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-card-foreground">Trình độ</label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as RoadmapFormValue["level"] })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            >
              <option value="beginner">Mới bắt đầu</option>
              <option value="intermediate">Trung cấp</option>
              <option value="advanced">Nâng cao</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-card-foreground">Mục tiêu</label>
            <select
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value as RoadmapFormValue["goal"] })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            >
              <option value="suc-khoe">Sức khỏe</option>
              <option value="cuu-ho">Cứu hộ</option>
              <option value="the-thao">Thể thao</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-card-foreground">Buổi/tuần</label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as RoadmapFormValue["frequency"] })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            >
              <option value="2">2 buổi/tuần</option>
              <option value="3">3 buổi/tuần</option>
              <option value="4">4 buổi/tuần</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 text-card-foreground">Tiền sử sức khỏe nếu có</label>
          <div className="space-y-2">
            {healthOptions.map((option) => (
              <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.healthHistory.includes(option.id)}
                  onChange={() => toggleHealth(option.id)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "var(--primary)" }}
                />
                <span className="text-muted-foreground">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full py-3 rounded-lg">
          Tạo lộ trình
        </Button>
      </form>
    </div>
  );
}
