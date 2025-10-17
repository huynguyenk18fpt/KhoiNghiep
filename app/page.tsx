// app/page.tsx
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import NewsSection from "@/components/news-section";
import ProductsSection from "@/components/products-section";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <HeroSection />
          <NewsSection />
          <ProductsSection />
        </main>
        <Footer />
      </div>
    
  );
}
