export interface Roadmap {
  title: string;
  description: string;
  goals: string[];
}

export const generateRoadmap = (formData: any): Roadmap => {
  let roadmap = {
    title: "",
    description: "",
    goals: [] as string[],
  };

  const { age, height, weight, skillLevel, goal, frequency } = formData;

  if (skillLevel === "beginner") {
    roadmap = {
      title: "Lộ trình 1: Cơ bản – Làm quen nước",
      description: `Lộ trình này dành cho độ tuổi ${age} với chiều cao ${height}cm và cân nặng ${weight}kg.`,
      goals: [
        "Làm quen với nước",
        "Học kỹ năng nổi cơ bản",
        "Thở dưới nước đúng cách",
        "Bắt đầu học chân ếch hoặc đạp nước nhẹ",
      ],
    };
  } else if (skillLevel === "intermediate") {
    roadmap = {
      title: "Lộ trình 2: Nâng cao kỹ thuật cơ bản",
      description: `Lộ trình này dành cho những người đã biết bơi sơ cấp và muốn nâng cao kỹ thuật bơi.`,
      goals: [
        "Bơi ếch, bơi tự do",
        "Cải thiện kỹ năng thở dưới nước",
        "Tập trung vào sức bền và kỹ thuật",
      ],
    };
  } else {
    roadmap = {
      title: "Lộ trình 3: Phòng chống đuối nước chủ động",
      description: `Lộ trình này dành cho người đã thành thạo bơi cơ bản, học kỹ năng phòng chống đuối nước và cứu hộ.`,
      goals: [
        "Cải thiện kỹ thuật bơi",
        "Học cứu hộ cơ bản",
        "Tăng sức bền và duy trì phản xạ khi gặp tình huống nguy hiểm",
      ],
    };
  }

  return roadmap;
};
