"use client"; // Thêm dòng này
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const combos = [
    { id: 1, name: "Combo Cơ Bản", price: "150.000 VND", image: "/COMBO/COMBO-CO-BAN.png" },
    { id: 2, name: "Combo Nâng Cao", price: "400.000 VND", image: "/COMBO/COMBO-NANG-CAO.png" },
    { id: 3, name: "Combo Rèn Luyện", price: "800.000 VND", image: "/COMBO/COMBO-REN-LUYEN.png" },
  ];

  const equiments = [
    { id: 1, name: "Phao tam giác", price: "90.000 VND", image: "/Equiments/Phao-Tay.png" },
    { id: 2, name: "Kính bơi", price: "75.000 VND", image: "/Equiments/Kinh-boi.png" },
    { id: 3, name: "Phao tay", price: "55.000 VND", image: "/Equiments/PHAO.png" },
    { id: 4, name: "Mũ bơi", price: "50.000 VND", image: "/Equiments/MU-BOI.png" },
    { id: 5, name: "Chân vịt", price: "500.000 VND", image: "/Equiments/CHAN-VIT.png" },
    { id: 6, name: "Kính lặn", price: "300.000 VND", image: "/Equiments/ONG-THO.png" },
  ];

  const handleContact = (name: string) => {
    // Mở Messenger hoặc WhatsApp để liên hệ
    const message = `Chào bạn, tôi muốn mua sản phẩm "${name}".`;
    const messengerLink = `https://m.me/865622756624048?text=${encodeURIComponent(message)}`;
    const whatsappLink = `https://wa.me/phone_number?text=${encodeURIComponent(message)}`;
    
    // Bạn có thể thay đổi Messenger/WhatsApp tùy theo mục đích
    window.open(messengerLink, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Combo Section */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Combo Trang bị</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {combos.map((combo) => (
                <div key={combo.id} className="bg-white rounded-lg shadow-md overflow-hidden border-[1px] border-gray-300">
                  <div className="aspect-square bg-white p-8">
                    <img src={combo.image} alt={combo.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{combo.name}</h3>
                    <p className="text-lg font-bold text-blue-600 mb-4">{combo.price}</p>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleContact(combo.name)} // Liên hệ mua
                    >
                      Liên hệ để mua
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Individual Products Section */}
          <section>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Trang bị</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {equiments.map((equiment) => (
                <div key={equiment.id} className="bg-white rounded-lg shadow-md overflow-hidden border-[1px] border-gray-300">
                  <div className="aspect-square bg-white p-8">
                    <img src={equiment.image} alt={equiment.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{equiment.name}</h3>
                    <p className="text-lg font-bold text-blue-600 mb-4">{equiment.price}</p>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleContact(equiment.name)} // Liên hệ mua
                    >
                      Liên hệ để mua
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
