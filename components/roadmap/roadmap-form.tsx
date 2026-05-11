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

const healthOptions = [
  { id: "asthma", label: "Hen suyễn" },
  { id: "heart", label: "Tim mạch" },
  { id: "bp", label: "Huyết áp" },
  { id: "joint", label: "Khớp" },
  { id: "other", label: "Khác" },
];

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

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.age || Number(formData.age) < 6 || Number(formData.age) > 100) {
      nextErrors.age = "Tuổi không hợp lệ, tối thiểu là 6.";
    }
    if (!formData.height || Number(formData.height) < 100) {
      nextErrors.height = "Chiều cao tối thiểu là 100cm.";
    }
    if (!formData.weight || Number(formData.weight) < 20) {
      nextErrors.weight = "Cân nặng tối thiểu là 20kg.";
    }
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

  const fieldState = (name: "age" | "height" | "weight") => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  const showSafetyWarning = formData.goal === "cuu-ho" || formData.healthHistory.length > 0;

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="rounded-xl border border-sky-100 bg-sky-50 p-4 text-sm leading-6 text-sky-950">
          <p className="font-semibold">Thông tin riêng tư và an toàn</p>
          <p className="mt-1">
            Floaty dùng thông tin này để tạo lộ trình tham khảo. Kết quả không thay thế tư vấn của bác sĩ, phụ huynh
            hoặc huấn luyện viên trực tiếp, đặc biệt khi có bệnh nền hoặc luyện kỹ năng cứu hộ.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="age" className="mb-2 block text-sm font-medium text-card-foreground">
              Tuổi
            </label>
            <input
              id="age"
              type="number"
              min={6}
              max={100}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2"
              {...fieldState("age")}
            />
            {errors.age ? (
              <p id="age-error" className="mt-1 text-xs text-red-600">
                {errors.age}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="height" className="mb-2 block text-sm font-medium text-card-foreground">
              Chiều cao (cm)
            </label>
            <input
              id="height"
              type="number"
              min={100}
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2"
              {...fieldState("height")}
            />
            {errors.height ? (
              <p id="height-error" className="mt-1 text-xs text-red-600">
                {errors.height}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="weight" className="mb-2 block text-sm font-medium text-card-foreground">
              Cân nặng (kg)
            </label>
            <input
              id="weight"
              type="number"
              min={20}
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2"
              {...fieldState("weight")}
            />
            {errors.weight ? (
              <p id="weight-error" className="mt-1 text-xs text-red-600">
                {errors.weight}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="level" className="mb-2 block text-sm font-medium text-card-foreground">
              Trình độ
            </label>
            <select
              id="level"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as RoadmapFormValue["level"] })}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2"
            >
              <option value="beginner">Mới bắt đầu</option>
              <option value="intermediate">Trung cấp</option>
              <option value="advanced">Nâng cao</option>
            </select>
          </div>

          <div>
            <label htmlFor="goal" className="mb-2 block text-sm font-medium text-card-foreground">
              Mục tiêu
            </label>
            <select
              id="goal"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value as RoadmapFormValue["goal"] })}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2"
            >
              <option value="suc-khoe">Sức khỏe</option>
              <option value="cuu-ho">Cứu hộ</option>
              <option value="the-thao">Thể thao</option>
            </select>
          </div>

          <div>
            <label htmlFor="frequency" className="mb-2 block text-sm font-medium text-card-foreground">
              Buổi/tuần
            </label>
            <select
              id="frequency"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as RoadmapFormValue["frequency"] })}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2"
            >
              <option value="2">2 buổi/tuần</option>
              <option value="3">3 buổi/tuần</option>
              <option value="4">4 buổi/tuần</option>
            </select>
          </div>
        </div>

        <fieldset>
          <legend className="mb-3 block text-sm font-medium text-card-foreground">Tiền sử sức khỏe nếu có</legend>
          <div className="space-y-2">
            {healthOptions.map((option) => (
              <label key={option.id} htmlFor={`health-${option.id}`} className="flex cursor-pointer items-center gap-2">
                <input
                  id={`health-${option.id}`}
                  type="checkbox"
                  checked={formData.healthHistory.includes(option.id)}
                  onChange={() => toggleHealth(option.id)}
                  className="h-4 w-4 rounded"
                  style={{ accentColor: "var(--primary)" }}
                />
                <span className="text-muted-foreground">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {showSafetyWarning ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950" role="note">
            {formData.goal === "cuu-ho" ? (
              <p>
                Kỹ năng cứu hộ cần được học trực tiếp với huấn luyện viên. Không tự lao xuống cứu người khi chưa được
                đào tạo; ưu tiên gọi trợ giúp và dùng dụng cụ hỗ trợ từ bờ.
              </p>
            ) : null}
            {formData.healthHistory.length > 0 ? (
              <p className={formData.goal === "cuu-ho" ? "mt-2" : undefined}>
                Nếu có bệnh nền hoặc dấu hiệu khó thở, chóng mặt, đau ngực, hãy hỏi bác sĩ/HLV trực tiếp trước khi tăng
                cường độ luyện tập.
              </p>
            ) : null}
          </div>
        ) : null}

        <Button type="submit" className="w-full rounded-lg py-3">
          Tạo lộ trình
        </Button>
      </form>
    </div>
  );
}
