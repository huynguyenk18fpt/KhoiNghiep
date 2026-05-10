"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { newsArticles } from "@/lib/data/news";

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 4;
  const totalPages = Math.ceil(newsArticles.length / articlesPerPage);
  const currentArticles = newsArticles.slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Tin tức</h1>
            <p className="text-gray-600 max-w-md md:text-right">
              Floaty cập nhật thông tin thường xuyên về an toàn dưới nước và phòng chống đuối nước.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentArticles.map((article) => (
              <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Link href={article.link} target="_blank" rel="noopener noreferrer">
                  <div className="aspect-video bg-gray-200 cursor-pointer relative">
                    <Image src={article.image} alt={article.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{article.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{article.description}</p>
                    <p className="text-xs text-gray-500">{article.date}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-6 py-3 mx-2 bg-blue-500 text-white rounded-lg transition-transform hover:scale-105 disabled:bg-gray-400"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-6 py-3 mx-2 rounded-lg transition-all transform ${
                    currentPage === index + 1 ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-6 py-3 mx-2 bg-blue-500 text-white rounded-lg transition-transform hover:scale-105 disabled:bg-gray-400"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
