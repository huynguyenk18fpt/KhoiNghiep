"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, LocateFixed, MapPin, Navigation } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pools, type Pool } from "@/lib/data/pools";

const PoolsMap = dynamic(() => import("@/components/pools/pools-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[360px] items-center justify-center bg-slate-50 text-sm text-slate-500">
      Đang tải bản đồ...
    </div>
  ),
});

type UserLocation = {
  lat: number;
  lng: number;
};

type PoolWithDistance = Pool & {
  distanceKm: number | null;
};

const RESULTS_PER_PAGE = 5;
const fallbackPool = pools[0];

function getDistanceKm(from: UserLocation, to: Pick<Pool, "lat" | "lng">) {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function formatDistance(distanceKm: number | null) {
  if (distanceKm === null) return null;
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
  return `${distanceKm.toFixed(1)} km`;
}

export default function PoolsPage() {
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedPool, setSelectedPool] = useState<Pool>(fallbackPool);
  const [page, setPage] = useState(1);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  const districtOptions = useMemo(
    () => Array.from(new Set(pools.map((pool) => pool.district))).sort((a, b) => a.localeCompare(b, "vi")),
    [],
  );

  const poolsWithDistance = useMemo<PoolWithDistance[]>(
    () =>
      pools.map((pool) => ({
        ...pool,
        distanceKm: userLocation ? getDistanceKm(userLocation, pool) : null,
      })),
    [userLocation],
  );

  const filteredPools = useMemo(() => {
    const districtPools =
      selectedDistrict === "all"
        ? poolsWithDistance
        : poolsWithDistance.filter((pool) => pool.district === selectedDistrict);

    if (!userLocation) return districtPools;

    return [...districtPools].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
  }, [poolsWithDistance, selectedDistrict, userLocation]);

  const totalPages = Math.max(1, Math.ceil(filteredPools.length / RESULTS_PER_PAGE));
  const paginatedPools = filteredPools.slice((page - 1) * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE);
  const selectedDistance = formatDistance(
    filteredPools.find((pool) => pool.id === selectedPool.id)?.distanceKm ?? null,
  );

  useEffect(() => {
    setPage(1);
  }, [selectedDistrict, userLocation]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    const nextPool = filteredPools.find((pool) => pool.id === selectedPool.id) ?? filteredPools[0] ?? fallbackPool;
    if (nextPool.id !== selectedPool.id) {
      setSelectedPool(nextPool);
    }
  }, [filteredPools, selectedPool.id]);

  const handleSelectPool = (pool: Pool) => {
    setSelectedPool(pool);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Trình duyệt hiện tại không hỗ trợ lấy vị trí.");
      return;
    }

    setLocating(true);
    setLocationMessage(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationMessage("Đã sắp xếp hồ bơi theo khoảng cách gần bạn.");
        setLocating(false);
      },
      () => {
        setLocationMessage("Không lấy được vị trí. Danh sách đang giữ thứ tự mặc định.");
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60000,
        timeout: 10000,
      },
    );
  };

  const handleClearLocation = () => {
    setUserLocation(null);
    setLocationMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="pb-16 pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-medium text-blue-600">Floaty Maps</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">Hồ bơi quanh Cần Thơ</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Tìm hồ bơi phù hợp để luyện tập an toàn, xem vị trí trên bản đồ và mở chỉ đường nhanh.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
            <section className="space-y-5">
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <label htmlFor="district" className="mb-2 block text-sm font-medium text-slate-700">
                      Quận, huyện
                    </label>
                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                      <SelectTrigger id="district" className="h-11 w-full">
                        <SelectValue placeholder="Chọn khu vực" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả khu vực</SelectItem>
                        {districtOptions.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 gap-2"
                      onClick={handleUseLocation}
                      disabled={locating}
                    >
                      <LocateFixed className="h-4 w-4" />
                      {locating ? "Đang lấy vị trí" : "Dùng vị trí của tôi"}
                    </Button>
                    {userLocation ? (
                      <Button type="button" variant="ghost" className="h-11" onClick={handleClearLocation}>
                        Bỏ sắp xếp
                      </Button>
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span>{filteredPools.length} hồ bơi</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span>
                    Trang {page}/{totalPages}
                  </span>
                  {locationMessage ? <span className="text-blue-700">{locationMessage}</span> : null}
                </div>
              </div>

              <div className="space-y-3">
                {paginatedPools.map((pool, index) => {
                  const displayIndex = (page - 1) * RESULTS_PER_PAGE + index + 1;
                  const distance = formatDistance(pool.distanceKm);
                  const isSelected = selectedPool.id === pool.id;

                  return (
                    <article
                      key={pool.id}
                      className={`rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md ${
                        isSelected ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200"
                      }`}
                    >
                      <button type="button" className="block w-full text-left" onClick={() => handleSelectPool(pool)}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase text-slate-400">#{displayIndex}</p>
                            <h2 className="mt-1 text-lg font-semibold text-slate-950">{pool.name}</h2>
                          </div>
                          {distance ? (
                            <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                              {distance}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 flex gap-2 text-sm leading-6 text-slate-600">
                          <MapPin className="mt-1 h-4 w-4 shrink-0 text-blue-600" />
                          <span>{pool.address}</span>
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{pool.district}</p>
                      </button>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={isSelected ? "default" : "outline"}
                          className={isSelected ? "gap-2 bg-blue-600 hover:bg-blue-700" : "gap-2"}
                          onClick={() => handleSelectPool(pool)}
                        >
                          <MapPin className="h-4 w-4" />
                          Xem trên bản đồ
                        </Button>
                        <Button asChild type="button" size="sm" variant="outline" className="gap-2">
                          <a href={pool.mapLink} target="_blank" rel="noopener noreferrer">
                            <Navigation className="h-4 w-4" />
                            Chỉ đường
                          </a>
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <span className="text-sm font-medium text-slate-600">
                  {page} / {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  disabled={page === totalPages}
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </section>

            <aside className="lg:sticky lg:top-6 lg:self-start">
              <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <div className="border-b px-4 py-3">
                  <p className="text-sm font-medium text-slate-500">Đang chọn</p>
                  <h2 className="text-lg font-semibold text-slate-950">{selectedPool.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {selectedPool.address}
                    {selectedDistance ? ` · ${selectedDistance}` : ""}
                  </p>
                </div>
                <div className="h-[360px] sm:h-[460px] lg:h-[680px]">
                  <PoolsMap
                    pools={filteredPools}
                    selectedPool={selectedPool}
                    userLocation={userLocation}
                    onSelectPool={handleSelectPool}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
