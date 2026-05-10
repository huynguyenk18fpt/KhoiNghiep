export interface NewsArticle {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  link: string;
}

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "Hiểm họa đuối nước rình rập trẻ em sau mưa lũ",
    description:
      "Các ca tai nạn đuối nước sau mưa lũ tiếp tục là lời nhắc mạnh về việc giám sát trẻ em và trang bị kỹ năng an toàn dưới nước.",
    image: "/news/id1.jpeg",
    date: "16/10/2025",
    link: "https://baodautu.vn/hiem-hoa-duoi-nuoc-rinh-rap-tre-em-sau-mua-lu-d413811.html",
  },
  {
    id: 2,
    title: "Thiếu niên gặp nạn dưới suối khi đi dã ngoại",
    description:
      "Một vụ tai nạn tại khu vực suối cho thấy rủi ro khi vui chơi ở vùng nước tự nhiên, đặc biệt khi thiếu giám sát và đánh giá độ sâu.",
    image: "https://i1-vnexpress.vnecdn.net/2025/08/12/hayho-1754992130-1754992197-90-7924-2587-1754994247.jpg?w=1020&h=0&q=100&dpr=1&fit=crop&s=Mv_v9W5MibqN1Xk3fBB-cw",
    date: "16/10/2025",
    link: "https://vnexpress.net/thieu-nien-gap-nan-duoi-suoi-khi-di-da-ngoai-4926019.html",
  },
  {
    id: 3,
    title: "Y sĩ quân y cứu nạn nhân đuối nước",
    description:
      "Câu chuyện cứu nạn nhấn mạnh vai trò của phản ứng nhanh, kỹ năng sơ cứu và thiết bị hỗ trợ khi gặp sự cố dưới nước.",
    image: "https://file3.qdnd.vn/data/images/0/2025/10/15/upload_2263/anh%201.jpg?dpi=150&quality=100&w=870",
    date: "15/10/2025",
    link: "https://www.qdnd.vn/nuoi-duong-van-hoa-bo-doi-cu-ho/y-si-quan-y-dung-cam-cuu-nan-nhan-duoi-nuoc-865261",
  },
  {
    id: 4,
    title: "Cứu trẻ nhỏ trong mưa lũ: bài học về an toàn cộng đồng",
    description:
      "Những vụ việc trong mùa mưa lũ cho thấy trẻ em cần được nhắc nhở tránh ao, hồ, kênh rạch và khu vực nước chảy mạnh.",
    image: "https://cdn.nhandan.vn/images/1135af555948f41abc837164bfcbe045bd898ec905c07293e554eab909b8df53ded678a3d65f2454cacb67789624e265/rsz-loan-3.jpg",
    date: "07/10/2025",
    link: "https://nhandan.vn/to-truong-bao-ve-an-ninh-dung-cam-hy-sinh-cuu-3-chau-nho-duoi-nuoc-post912314.html",
  },
  {
    id: 5,
    title: "Du khách bị sóng cuốn ở biển",
    description:
      "Khi tắm biển, cần quan sát cảnh báo, không bơi xa bờ và tránh vùng có dòng chảy mạnh hoặc thời tiết xấu.",
    image: "https://i1-vnexpress.vnecdn.net/2025/09/01/pq-1756694009-1756694058-2704-9207-1363-1756696945.jpg?w=1020&h=0&q=100&dpr=1&fit=crop&s=pQqyTdCok7ZnRN14IpndfA",
    date: "01/09/2025",
    link: "https://vnexpress.net/5-du-khach-bi-song-cuon-o-bien-phu-quoc-4933888.html",
  },
  {
    id: 6,
    title: "Học sinh gặp nạn khi tắm biển",
    description:
      "Các nhóm học sinh cần có người lớn đi cùng, không tự ý xuống nước và luôn tuân thủ biển báo an toàn.",
    image: "https://i1-vnexpress.vnecdn.net/2025/08/22/z6932272387194-ba208a5a2fa3a34-2831-4953-1755831542.jpg?w=1020&h=0&q=100&dpr=1&fit=crop&s=jfg2KftZ2BSRO_fuXkOofQ",
    date: "22/08/2025",
    link: "https://vnexpress.net/ba-nam-sinh-gap-nan-khi-tam-bien-hai-tien-4930121.html",
  },
];
