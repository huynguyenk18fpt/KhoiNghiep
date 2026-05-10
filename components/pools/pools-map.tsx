"use client";

import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { Pool } from "@/lib/data/pools";

type UserLocation = {
  lat: number;
  lng: number;
};

type PoolsMapProps = {
  pools: Pool[];
  selectedPool: Pool;
  userLocation: UserLocation | null;
  onSelectPool: (pool: Pool) => void;
};

const defaultCenter: [number, number] = [10.0309, 105.7689];

const poolIcon = new L.Icon({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedPoolIcon = new L.Icon({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [32, 52],
  iconAnchor: [16, 52],
  popupAnchor: [1, -42],
  shadowSize: [41, 41],
});

const userIcon = L.divIcon({
  className: "",
  html: '<span class="block h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-lg ring-4 ring-blue-200"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function MapFocus({ selectedPool }: { selectedPool: Pool }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([selectedPool.lat, selectedPool.lng], 14, {
      duration: 0.6,
    });
  }, [map, selectedPool.id, selectedPool.lat, selectedPool.lng]);

  return null;
}

function MapBounds({ pools }: { pools: Pool[] }) {
  const map = useMap();

  useEffect(() => {
    if (pools.length <= 1) return;

    const bounds = L.latLngBounds(pools.map((pool) => [pool.lat, pool.lng]));
    map.fitBounds(bounds, {
      padding: [36, 36],
      maxZoom: 14,
    });
  }, [map, pools]);

  return null;
}

export default function PoolsMap({ pools, selectedPool, userLocation, onSelectPool }: PoolsMapProps) {
  const center = useMemo<[number, number]>(
    () => (selectedPool ? [selectedPool.lat, selectedPool.lng] : defaultCenter),
    [selectedPool],
  );

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapBounds pools={pools} />
      <MapFocus selectedPool={selectedPool} />

      {userLocation ? (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>Vị trí của bạn</Popup>
        </Marker>
      ) : null}

      {pools.map((pool) => (
        <Marker
          key={pool.id}
          position={[pool.lat, pool.lng]}
          icon={pool.id === selectedPool.id ? selectedPoolIcon : poolIcon}
          eventHandlers={{
            click: () => onSelectPool(pool),
          }}
        >
          <Popup>
            <div className="space-y-1">
              <strong className="block text-sm text-gray-900">{pool.name}</strong>
              <span className="block text-xs text-gray-600">{pool.address}</span>
              <a
                href={pool.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-blue-600 underline"
              >
                Chỉ đường
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
