"use client"; 
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Form({ onSubmit }: { onSubmit: (formData: any) => void }) {
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
      other: false,  // For any other health issues
      otherDetails: ""  // Field to capture details if 'other' is selected
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked; // Type assertion here
      setFormData({
        ...formData,
        healthStatus: {
          ...formData.healthStatus,
          [name]: checked,  // Update checkbox state
          otherDetails: name === "other" && !checked ? "" : formData.healthStatus.otherDetails, // Reset 'other' detail if unchecked
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-700">Độ tuổi:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Nhập độ tuổi"
          min="6"
        />
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
          min="100"
        />
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
          min="20"
        />
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

      {/* Health Status - Checkbox */}
      <div>
        <p className="text-gray-700">Tiền sử sức khỏe (chọn những vấn đề bạn gặp phải):</p>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="heartDisease"
              checked={formData.healthStatus.heartDisease}
              onChange={handleChange}
              className="mr-2"
            />
            Bệnh tim mạch
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="asthma"
              checked={formData.healthStatus.asthma}
              onChange={handleChange}
              className="mr-2"
            />
            Hen suyễn
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="jointProblems"
              checked={formData.healthStatus.jointProblems}
              onChange={handleChange}
              className="mr-2"
            />
            Vấn đề về khớp
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="highBloodPressure"
              checked={formData.healthStatus.highBloodPressure}
              onChange={handleChange}
              className="mr-2"
            />
            Huyết áp cao
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="other"
              checked={formData.healthStatus.other}
              onChange={handleChange}
              className="mr-2"
            />
            Khác
          </label>
        </div>

        {/* Only show 'otherDetails' if 'other' checkbox is selected */}
        {formData.healthStatus.other && (
          <div>
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
        <Button onClick={handleSubmit} size="lg" className="bg-blue-600 hover:bg-blue-700">
          Bắt đầu hành trình của bạn
        </Button>
      </div>
    </div>
  );
}
