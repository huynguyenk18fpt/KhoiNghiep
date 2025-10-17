// lib/data/roadmap.ts

export interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  duration: string;
  skills: string[];
}

export const roadmapSteps: RoadmapStep[] = [
  {
    id: 1,
    title: "Bước 1: Làm quen với nước",
    description: "Học cách thoải mái trong môi trường nước, thở đúng cách và nổi cơ bản",
    duration: "2-3 tuần",
    skills: ["Thở trong nước", "Nổi trên mặt nước", "Di chuyển cơ bản"],
  },
  {
    id: 2,
    title: "Bước 2: Kỹ thuật bơi cơ bản",
    description: "Học các kiểu bơi cơ bản như bơi ếch, bơi tự do",
    duration: "4-6 tuần",
    skills: ["Bơi ếch", "Bơi tự do", "Quay người trong nước"],
  },
  {
    id: 3,
    title: "Bước 3: An toàn nước nâng cao",
    description: "Học cách tự cứu và cứu người khác trong tình huống khẩn cấp",
    duration: "3-4 tuần",
    skills: ["Tự cứu khi đuối nước", "Cứu người đuối nước", "Sử dụng dụng cụ cứu hộ"],
  },
  {
    id: 4,
    title: "Bước 4: Thành thạo và duy trì",
    description: "Luyện tập thường xuyên để duy trì và nâng cao kỹ năng",
    duration: "Liên tục",
    skills: ["Bơi lội thể thao", "Dạy người khác", "Tham gia cứu hộ"],
  },
];
