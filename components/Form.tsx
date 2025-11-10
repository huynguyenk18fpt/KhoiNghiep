"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Form({
  onSubmit,
  errors,
  busy,
}: {
  onSubmit: (formData: any) => void;
  errors?: Record<string, string> | null;
  busy?: boolean;
}) {
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    skillLevel: "",
    goal: "",
    frequency: "",
    healthStatus: {
      heartDisease: false,
      asthma: false,
      jointProblems: false,
      highBloodPressure: false,
      other: false,
      otherDetails: "",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        healthStatus: {
          ...prev.healthStatus,
          [name]: checked,
          otherDetails: name === "other" && !checked ? "" : prev.healthStatus.otherDetails,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const errorText = (k: string) =>
    errors && errors[k] ? <p className="text-red-600 text-sm mt-1">{errors[k]}</p> : null;

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block text-gray-700">Độ tuổi:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Nhập độ tuổi"
          min={6}
        />
        {errorText("age")}
      </div>

      <div>
        <label className="block text-gray-700">Chiều cao (cm):</label>
        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Nhập chiều cao"
          min={100}
        />
        {errorText("height")}
      </div>

      <div>
        <label className="block text-gray-700">Cân nặng (kg):</label>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Nhập cân nặng"
          min={20}
        />
        {errorText("weight")}
      </div>

      <div>
        <label className="block text-gray-700">Trình độ hiện tại:</label>
        <select
          name="skillLevel"
          value={formData.skillLevel}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="">Chọn trình độ</option>
          <option value="beginner">Mới bắt đầu</option>
          <option value="intermediate">Đã biết cơ bản</option>
          <option value="advanced">Thành thạo cơ bản</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700">Mục tiêu học bơi:</label>
        <select
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="">Chọn mục tiêu</option>
          <option value="swimmingForHealth">Học bơi để nâng cao sức khỏe</option>
          <option value="rescueSkills">Học cứu hộ và phòng chống đuối nước</option>
          <option value="sportsSwimming">Học bơi thể thao</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700">Tần suất học bơi:</label>
        <select
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="">Chọn tần suất</option>
          <option value="2timesWeek">2 buổi/tuần</option>
          <option value="3timesWeek">3 buổi/tuần</option>
          <option value="4timesWeek">4 buổi/tuần</option>
        </select>
      </div>

      <div>
        <p className="text-gray-700">Tiền sử sức khỏe:</p>
        <div className="space-y-2">
          {[
            { key: "heartDisease", label: "Bệnh tim mạch" },
            { key: "asthma", label: "Hen suyễn" },
            { key: "jointProblems", label: "Vấn đề về khớp" },
            { key: "highBloodPressure", label: "Huyết áp cao" },
            { key: "other", label: "Khác" },
          ].map((x) => (
            <label key={x.key} className="flex items-center">
              <input
                type="checkbox"
                name={x.key}
                checked={(formData as any).healthStatus[x.key]}
                onChange={handleChange}
                className="mr-2"
              />
              {x.label}
            </label>
          ))}
        </div>

        {formData.healthStatus.other && (
          <div className="mt-2">
            <label className="block text-gray-700">Vui lòng ghi rõ chi tiết:</label>
            <input
              type="text"
              name="otherDetails"
              value={formData.healthStatus.otherDetails}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Nhập chi tiết vấn đề sức khỏe khác"
            />
          </div>
        )}
      </div>

      <div className="text-center">
        <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700" disabled={busy}>
          {busy ? "Đang tạo lộ trình..." : "Bắt đầu hành trình của bạn"}
        </Button>
      </div>
    </form>
  );
}
