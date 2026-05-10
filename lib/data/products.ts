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
    image: "/COMBO/COMBO-CO-BAN.png",
    category: "combo",
    description: "Bộ dụng cụ cơ bản cho người mới bắt đầu học bơi an toàn.",
  },
  {
    id: "combo-advanced",
    name: "Combo Nâng Cao",
    price: 400000,
    image: "/COMBO/COMBO-NANG-CAO.png",
    category: "combo",
    description: "Bộ trang bị nâng cao cho luyện tập thường xuyên.",
  },
  {
    id: "combo-training",
    name: "Combo Rèn Luyện",
    price: 800000,
    image: "/COMBO/COMBO-REN-LUYEN.png",
    category: "combo",
    description: "Bộ luyện tập đầy đủ cho mục tiêu kỹ thuật và thể lực.",
  },
  {
    id: "float-board",
    name: "Phao tam giác",
    price: 90000,
    image: "/Equiments/Phao-Tay.png",
    category: "equipment",
  },
  {
    id: "swim-goggles",
    name: "Kính bơi",
    price: 75000,
    image: "/Equiments/Kinh-boi.png",
    category: "equipment",
  },
  {
    id: "arm-floats",
    name: "Phao tay",
    price: 55000,
    image: "/Equiments/PHAO.png",
    category: "equipment",
  },
  {
    id: "swim-cap",
    name: "Mũ bơi",
    price: 50000,
    image: "/Equiments/MU-BOI.png",
    category: "equipment",
  },
  {
    id: "swim-fins",
    name: "Chân vịt",
    price: 500000,
    image: "/Equiments/CHAN-VIT.png",
    category: "equipment",
  },
  {
    id: "snorkel",
    name: "Kính lặn",
    price: 300000,
    image: "/Equiments/ONG-THO.png",
    category: "equipment",
  },
];

export function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
