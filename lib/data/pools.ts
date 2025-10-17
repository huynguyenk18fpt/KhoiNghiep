// data/pools.ts

export interface Pool {
  id: number;
  name: string;
  address: string;
  district: string;
  lat: number | 0;
  lng: number | 0;
  mapLink: string;
}

export const pools: Pool[] = [

  // Ninh Kiều
  {
    id: 1,
    name: "Hồ bơi Hùng Quân",
    address: "122 Đ. Hoàng Quốc Việt, An Bình",
    district: "Ninh Kiều",
    lat: 10.012365959685381,
    lng: 105.74499808250836,
    mapLink: "https://www.google.com/maps/dir/?api=1&destination=10.012365959685381,105.74499808250836",
  },
  {
    id: 2,
    name: "Hồ bơi Công An Cần Thơ",
    address: "Đ. Trần Phú, Cái Khế",
    district: "Ninh Kiều",
    lat: 10.0505706867422,
    lng: 105.78846701203325,
    mapLink: "https://www.google.com/maps/dir/?api=1&destination=10.0505706867422,105.78846701203325",
  },
  {
    id: 3,
    name: "Hồ bơi Khách sạn Mường Thanh",
    address: "2QRR+V86 Tp, Vòng Xoay Công Viên Nước, Lê Lợi, Cái Khế",
    district: "Ninh Kiều",
    lat: 10.042136,
    lng: 105.789789,
    mapLink: "https://www.google.com/maps/dir/?api=1&destination=10.042136,105.789789",
  },
  {
    id: 4,
    name: "Hồ bơi Nhà thi đấu đa năng",
    address: "1 Lê Lợi, Cái Khế",
    district: "Ninh Kiều",
    lat: 10.046654179360868,
    lng: 105.78999827132958,
    mapLink: "https://www.google.com/maps/dir/?api=1&destination=10.046654179360868,105.78999827132958",
  },
  {
    id: 5,
    name: "Hồ bơi Khách sạn Sheraton Cần Thơ",
    address: "209 Đường 30/4, Xuân Khánh",
    district: "Ninh Kiều",
    lat: 10.024188891972893,
    lng: 105.77422897079498,
    mapLink: "https://www.google.com/maps/dir/?api=1&destination=10.024188891972893,105.77422897079498",
  },
  {
    id: 6,
    name: "Hồ bơi Victoria Cần Thơ Resort",
    address: "Cái Khế, Cồn Khương",
    district: "Ninh Kiều",
    lat: 10.039920111409653,
    lng: 105.7930694736726,
    mapLink: "https://www.google.com/maps/dir/?api=1&destination=10.039920111409653,105.7930694736726",
  },
  

  // Bình Thủy
  {
    id: 7,
    name: "Hồ bơi Ánh Viên Cần Thơ (CLB Bơi Lội Quân Khu 9)",
    address: "9 Đ. Nguyễn Đệ, An Hoà",
    district: "Bình Thủy",
    lat: 10.052066041450997,
    lng: 105.77000293253579,
    mapLink: "https://www.google.com/maps/dir/?api=1&destination=10.052066041450997,105.77000293253579",
  },
  {
    id: 8,
    name: "Hồ bơi Rạch Súc",
    address: "02 QL91B, kv Bình Phó A",
    district: "Bình Thủy",
    lat: 10.040194764465976,
    lng: 105.74054406448882,
    mapLink: "https://www.google.com/maps/dir/?api=1&destination=10.040194764465976,105.74054406448882",
  },


  // Cái Răng
 {
    id: 9,
    name: "Hồ Bơi Minh Phương",
    address: "32P Đ. Trương Vĩnh Nguyên, ấp Mỹ",
    district: "Cái Răng",
    lat: 9.993885312637362,
    lng: 105.75821797254893,
    mapLink: "https://www.google.com/maps/dir/?api=1&destination=9.993885312637362,105.75821797254893",
  },
  {
    id: 10,
    name: "Hồ bơi Nam Long",
    address: "2Q5P+69J, Hưng Khu dân cư Nam",
    district: "Cái Răng",
    lat: 10.008099663415964,
    lng: 105.78589417731433,
    mapLink: "https://www.google.com/maps/dir/?api=1&destination=10.008099663415964,105.78589417731433",
  },
  {
    id: 11,
    name: "CAFE HỒ BƠI ĐẠI PHÚ SKY",
    address: "2Q4Q+6G4, Đ. Số 3, Khu dân cư Vạn Phong",
    district: "Cái Răng",
    lat: 10.005229307088575,
    lng: 105.78863229998117,
    mapLink: "https://www.google.com/maps/dir/?api=1&destination=10.005229307088575,105.78863229998117",
  },
  {
    id: 12,
    name: "Hồ Bơi Mai Lan",
    address: "418B Đường Huỳnh Thị Nỡ, KV Thành Phú",
    district: "Cái Răng",
    lat: 9.970867187635204,
    lng: 105.75211771777222,
    mapLink: "https://www.google.com/maps/dir/?api=1&destination=9.970867187635204,105.75211771777222",
  },


  // Ô Môn
  {
    id: 13,
    name: "Cẩm Tú Hồ Bơi",
    address: "7 Tôn Đức Thắng, Châu Văn Liêm",
    district: "Ô Môn",
    lat: 10.109496236308685,
    lng: 105.6239140274386,
    mapLink: "https://www.google.com/maps/dir/?api=1&destination=10.109496236308685,105.6239140274386",
  },

  // Vĩnh Thạnh
  {
    id: 14,
    name: "Hồ bơi Thạnh An",
    address: "3263 QL80, Ấp Phụng Quới B",
    district: "Vĩnh Thạnh",
    lat: 10.153888714047868,
    lng: 105.32180450852958,
    mapLink: "https://www.google.com/maps/dir/?api=1&destination=10.153888714047868,105.32180450852958",
  },

  // Thốt Nốt
  {
    id: 15,
    name: "Sens Club",
    address: "Đường Thanh Niên, TT. Thốt Nốt",
    district: "Thốt Nốt",
    lat: 10.27227373773774,
    lng: 105.52824327821068,
    mapLink: "https://www.google.com/maps/dir/?api=1&destination=10.27227373773774,105.52824327821068",
  },
  {
    id: 16,
    name: "Hồ Bơi Ngọc Ngân",
    address: "7GFG+CVH, TT. Thốt Nốt",
    district: "Thốt Nốt",
    lat: 10.27357373629448,
    lng: 105.52721511565845,
    mapLink: "https://www.google.com/maps/dir/?api=1&destination=10.27357373629448,105.52721511565845",
  },

  
  
];
