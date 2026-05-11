export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "combo" | "equipment";
  description?: string;
};

export const products: Product[] = [
  {
    id: "combo-basic",
    name: "Combo Cơ Bản",
    price: 150000,
    image: "/products-optimized/COMBO-CO-BAN.jpg",
    category: "combo",
    description: "Bộ dụng cụ cơ bản cho người mới bắt đầu làm quen với nước và học bơi an toàn.",
  },
  {
    id: "combo-advanced",
    name: "Combo Nâng Cao",
    price: 400000,
    image: "/products-optimized/COMBO-NANG-CAO.jpg",
    category: "combo",
    description: "Bộ trang bị cho người đã biết bơi cơ bản và muốn luyện tập thường xuyên hơn.",
  },
  {
    id: "combo-training",
    name: "Combo Rèn Luyện",
    price: 800000,
    image: "/products-optimized/COMBO-REN-LUYEN.jpg",
    category: "combo",
    description: "Bộ luyện tập đầy đủ để cải thiện kỹ thuật, sức bền và sự tự tin khi xuống nước.",
  },
  {
    id: "float-board",
    name: "Phao tam giác",
    price: 90000,
    image: "/products-optimized/Phao-Tay.jpg",
    category: "equipment",
    description: "Hỗ trợ tập nổi, tập đạp chân và giữ tư thế ổn định khi học bơi.",
  },
  {
    id: "swim-goggles",
    name: "Kính bơi",
    price: 75000,
    image: "/products-optimized/Kinh-boi.jpg",
    category: "equipment",
    description: "Giúp bảo vệ mắt, nhìn rõ dưới nước và giảm cảm giác khó chịu khi luyện tập.",
  },
  {
    id: "arm-floats",
    name: "Phao tay",
    price: 55000,
    image: "/products-optimized/PHAO.jpg",
    category: "equipment",
    description: "Phụ kiện hỗ trợ nổi cho trẻ nhỏ khi làm quen với nước dưới sự giám sát của người lớn.",
  },
  {
    id: "swim-cap",
    name: "Mũ bơi",
    price: 50000,
    image: "/products-optimized/MU-BOI.jpg",
    category: "equipment",
    description: "Giữ tóc gọn, giảm cản nước và giúp buổi học bơi thoải mái hơn.",
  },
  {
    id: "swim-fins",
    name: "Chân vịt",
    price: 500000,
    image: "/products-optimized/CHAN-VIT.jpg",
    category: "equipment",
    description: "Hỗ trợ luyện lực chân, cảm giác nước và kỹ thuật đạp chân cho người tập nâng cao.",
  },
  {
    id: "snorkel",
    name: "Kính lặn",
    price: 300000,
    image: "/products-optimized/ONG-THO.jpg",
    category: "equipment",
    description: "Phù hợp luyện quan sát dưới nước và các bài tập làm quen môi trường nước.",
  },
];

export function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
