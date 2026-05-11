import type { Metadata } from "next";
import ProductsPageClient from "./products-page-client";

export const metadata: Metadata = {
  title: "Sản phẩm bơi lội an toàn | Floaty",
  description:
    "Combo và phụ kiện bơi lội hỗ trợ học bơi an toàn, phòng chống đuối nước cho trẻ em và gia đình.",
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
