import type { Metadata } from "next";
import RoadmapClient from "./roadmap-client";

export const metadata: Metadata = {
  title: "Lộ trình học bơi cá nhân hóa | Floaty",
  description:
    "Tạo lộ trình học bơi 8 tuần theo độ tuổi, thể trạng, mục tiêu và lưu ý an toàn với trợ lý Floaty.",
};

export default function RoadmapPage() {
  return <RoadmapClient />;
}
