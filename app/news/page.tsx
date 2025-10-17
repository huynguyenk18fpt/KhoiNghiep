// app/news/page.tsx
"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";// Nếu dữ liệu tĩnh, bạn vẫn có thể dùng trực tiếp
import Link from "next/link";
import { useState, useEffect } from "react";

interface NewsArticle {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  link: string;
}

// Server Component: Đưa `newsArticles` vào trực tiếp
export default function NewsPage() {
    const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 4;
  const totalPages = Math.ceil(newsArticles.length / articlesPerPage);

  useEffect(() => {
    import("@/lib/data/news").then((module) => {
      setNewsArticles(module.newsArticles);
    });
  }, []);

  // Cắt danh sách bài viết theo trang hiện tại
  const currentArticles = newsArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (newsArticles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <p>Đang tải...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tiêu đề và mô tả */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Tin tức</h1>
            <p className="text-gray-600 max-w-md text-right whitespace-nowrap">
              Floaty cập nhật thông tin thường xuyên về tình trạng đuối nước trên cả nước
            </p>
          </div>

          {/* Hiển thị các bài viết */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Link href={article.link}>
                  <div className="aspect-video bg-gray-200 cursor-pointer">
                    <img
                      src={article.image || "/placeholder.svg"} // Đảm bảo placeholder có sẵn
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {article.description || "Không có mô tả"}
                    </p>
                    <p className="text-xs text-gray-500">{article.date}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Phân trang */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-6 py-3 mx-2 bg-blue-500 text-white rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-400"
            >
              Previous
            </button>
            {[...Array(totalPages).keys()].map((i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-6 py-3 mx-2 rounded-lg transition-all transform ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-6 py-3 mx-2 bg-blue-500 text-white rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
