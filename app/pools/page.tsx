"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { pools } from "@/lib/data/pools"; // ✅ Import pools từ file riêng

// Style cho map container
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

// Vị trí mặc định
const defaultCenter = { lat: 10.0309, lng: 105.7689 };

export default function PoolsPage() {
  const [selectedPool, setSelectedPool] = useState(pools[0]);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState("all"); // Lọc theo quận huyện
  const [page, setPage] = useState(1); // Phân trang
  const mapRef = useRef<google.maps.Map | null>(null);

  const resultsPerPage = 5;

  // ✅ Kiểm tra biến môi trường
  const showMapEnv = process.env.NEXT_PUBLIC_ENABLE_MAP === "true";

  // ✅ Cho phép bật map trong dev qua query param ?showMap=1
  const [devShowMap, setDevShowMap] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setDevShowMap(params.get("showMap") === "1");
    }
  }, []);

  const showMap = showMapEnv || devShowMap;

  // ✅ Google Maps loader
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const handleActiveMarker = (markerId: number) => {
    if (markerId === activeMarker) return;
    setActiveMarker(markerId);
  };

  // Filter hồ bơi theo quận huyện
  const filteredPools = pools.filter(pool => 
    selectedDistrict === "all" || pool.district === selectedDistrict
  );

  // Paginate kết quả
  const paginatedPools = filteredPools.slice((page - 1) * resultsPerPage, page * resultsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Những hồ bơi quanh đây
              </h1>
              <div className="mb-8">
                <Select
                  defaultValue="all"
                  onValueChange={(value) => setSelectedDistrict(value)}
                >
                  <SelectTrigger className="w-full p-4 text-lg">
                    <SelectValue placeholder="Chọn quận huyện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Ninh Kiều">Ninh Kiều</SelectItem>
                    <SelectItem value="Bình Thủy">Bình Thủy</SelectItem>
                    <SelectItem value="Cái Răng">Cái Răng</SelectItem>
                    <SelectItem value="Ô Môn">Ô Môn</SelectItem>
                    <SelectItem value="Thốt Nốt">Thốt Nốt</SelectItem>
                    <SelectItem value="Vĩnh Thạnh">Vĩnh Thạnh</SelectItem>
                    <SelectItem value="Cờ Đỏ">Cờ Đỏ</SelectItem>
                    <SelectItem value="Thới Lai">Thới Lai</SelectItem>
                    <SelectItem value="Phong Điền">Phong Điền</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {paginatedPools.map((pool, index) => (
                  <div
                    key={pool.id}
                    onClick={() => {
                      setSelectedPool(pool);
                      if (mapRef.current) {
                        mapRef.current.panTo({
                          lat: pool.lat,
                          lng: pool.lng,
                        });
                      }
                    }}
                    className={`cursor-pointer bg-white p-4 rounded-lg shadow-sm border ${
                      selectedPool.id === pool.id
                        ? "border-blue-500 ring-1 ring-blue-200"
                        : "border-gray-200"
                    } hover:shadow-md transition`}
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      {index + 1}. {pool.name}
                    </h3>
                    <p className="text-sm text-gray-600">{pool.address}</p>
                    <a
                      href={pool.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm mt-2 inline-block hover:underline"
                    >
                      📍 Chỉ đường
                    </a>
                  </div>
                ))}
              </div>

              {/* Phân trang */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Trước
                </button>
                <span className="px-4 py-2">{page}</span>
                <button
                  onClick={() => setPage(page < Math.ceil(filteredPools.length / resultsPerPage) ? page + 1 : page)}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Sau
                </button>
              </div>
            </div>

            {/* Right - Google Map */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {showMap ? (
                isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{
                      width: "100%",
                      height: "800px", // Chỉ hiển thị nửa trên
                    }}
                    center={selectedPool ? { lat: selectedPool.lat, lng: selectedPool.lng } : defaultCenter}
                    zoom={14}
                    onLoad={(map) => {
                      mapRef.current = map;
                    }}
                    onUnmount={() => {
                      mapRef.current = null;
                    }}
                  >
                    {filteredPools.map((pool) => (
                      <Marker
                        key={pool.id}
                        position={{ lat: pool.lat, lng: pool.lng }}
                        onClick={() => handleActiveMarker(pool.id)}
                      >
                        {activeMarker === pool.id ? (
                          <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                            <div>
                              <strong>{pool.name}</strong>
                              <br />
                              {pool.address}
                              <br />
                              <a
                                href={pool.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                Đi tới đây
                              </a>
                            </div>
                          </InfoWindow>
                        ) : null}
                      </Marker>
                    ))}
                  </GoogleMap>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p>Đang load bản đồ...</p>
                  </div>
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center bg-gray-100">
                  <p className="text-gray-500 mb-2">Bản đồ đã bị tắt</p>
                  <p className="text-xs text-gray-400">
                    Thêm <code>?showMap=1</code> vào URL để bật tạm
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
