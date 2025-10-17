export interface NewsArticle {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  link: string; // Added link for each article
}

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "Hiểm họa đuối nước rình rập trẻ em sau mưa lũ",
    description: "Mới đây, Bệnh viện Nhi Trung ương tiếp nhận nhiều ca nhập viện trong tình trạng nguy kịch vì đuối nước, trong đó có trường hợp hai anh em sinh đôi tử vong thương tâm.",
    image: "/news/id1.jpeg",
    date: "16/10/2025",
    link: "https://baodautu.vn/hiem-hoa-duoi-nuoc-rinh-rap-tre-em-sau-mua-lu-d413811.html",
  },
  {
    id: 2,
    title: "Thiếu niên gặp nạn dưới suối khi đi dã ngoại",
    description: "Khánh Hòa-Thiếu niên 14 tuổi khi đi tắm suối Ba Hồ, xã Công Hải, đã gặp nạn, thi thể được tìm thấy ở hốc đá nằm sâu dưới nước.",
    image: "https://i1-vnexpress.vnecdn.net/2025/08/12/hayho-1754992130-1754992197-90-7924-2587-1754994247.jpg?w=1020&h=0&q=100&dpr=1&fit=crop&s=Mv_v9W5MibqN1Xk3fBB-cw",
    date: "16/10/2025",
    link: "https://vnexpress.net/thieu-nien-gap-nan-duoi-suoi-khi-di-da-ngoai-4926019.html",
  },
  {
    id: 4,
    title: "Y sĩ quân y dũng cảm cứu nạn nhân đuối nước",
    description: "Ngày 15-10, Ban chỉ huy Phòng thủ khu vực 6 - Đặc khu Côn Đảo (Bộ tư lệnh TP Hồ Chí Minh) cho biết, một đồng chí y sĩ thuộc bệnh xá của đơn vị, đã dũng cảm cứu sống nữ du khách bị đuối nước.",
    image: "https://file3.qdnd.vn/data/images/0/2025/10/15/upload_2263/anh%201.jpg?dpi=150&quality=100&w=870",
    date: "15/10/2025",
    link: "https://www.qdnd.vn/nuoi-duong-van-hoa-bo-doi-cu-ho/y-si-quan-y-dung-cam-cuu-nan-nhan-duoi-nuoc-865261",
  },
  {
    id: 5,
    title: "Tổ trưởng bảo vệ an ninh dũng cảm hy sinh cứu 3 cháu nhỏ đuối nước",
    description: "Trong mưa lũ lớn từ bão số 10, ông Phan Văn Thành, sinh năm 1989, Tổ trưởng Tổ bảo vệ an ninh trật tự ở cơ sở xóm Xuân Hà 1, xã Thành Công (tỉnh Thái Nguyên) dũng cảm hy sinh tính mạng cứu 3 cháu nhỏ khỏi bị đuối nước.",
    image: "https://cdn.nhandan.vn/images/1135af555948f41abc837164bfcbe045bd898ec905c07293e554eab909b8df53ded678a3d65f2454cacb67789624e265/rsz-loan-3.jpg",
    date: "07/10/2025",
    link: "https://nhandan.vn/to-truong-bao-ve-an-ninh-dung-cam-hy-sinh-cuu-3-chau-nho-duoi-nuoc-post912314.html",
  },
  {
    id: 7,
    title: "5 du khách bị sóng cuốn ở biển Phú Quốc",
    description: "An Giang-Trong lúc tắm biển Phú Quốc, nhóm du khách bị sóng cuốn, bốn người được cứu, một nạn nhân nguy kịch.",
    image: "https://i1-vnexpress.vnecdn.net/2025/09/01/pq-1756694009-1756694058-2704-9207-1363-1756696945.jpg?w=1020&h=0&q=100&dpr=1&fit=crop&s=pQqyTdCok7ZnRN14IpndfA",
    date: "01/09/2025",
    link: "https://vnexpress.net/5-du-khach-bi-song-cuon-o-bien-phu-quoc-4933888.html",
  },
  {
    id: 8,
    title: "Ba nam sinh gặp nạn khi tắm biển Hải Tiến",
    description: "Thanh Hóa-7 học sinh lớp 10-11 rủ nhau ra bờ biển Hải Tiến tắm, ba em bị sóng cuốn trôi, hiện mới tìm thấy một thi thể, một người mất tích.",
    image: "https://i1-vnexpress.vnecdn.net/2025/08/22/z6932272387194-ba208a5a2fa3a34-2831-4953-1755831542.jpg?w=1020&h=0&q=100&dpr=1&fit=crop&s=jfg2KftZ2BSRO_fuXkOofQ",
    date: "22/08/2025",
    link: "https://vnexpress.net/ba-nam-sinh-gap-nan-khi-tam-bien-hai-tien-4930121.html",
  },
  {
    id: 10,
    title: "Cà Mau: Hai học sinh chết đuối thương tâm",
    description: "Trong lúc đi đá bóng rồi rủ nhau xuống ao tắm, hai em học sinh ở xã Trần Văn Thời (tỉnh Cà Mau) không may bị đuối nước dẫn đến tử vong.",
    image: "https://cdn2.tuoitre.vn/thumb_w/730/471584752817336320/2025/7/16/0c1df3f2b50f03515a1e-17526297587592082191090.jpg",
    date: "16/07/2025",
    link: "https://tuoitre.vn/ca-mau-hai-hoc-sinh-chet-duoi-thuong-tam-20250716084844857.htm",
  },
  {
    id: 11,
    title: "Bé trai từ miền Nam theo gia đình về quê tắm thác Đẹn bị đuối nước tử vong",
    description: "Khoảng 13h ngày 16/7, tại khu vực thác Đẹn, xã Thành Vinh, tỉnh Thanh Hóa xảy ra vụ đuối nước làm một bé trai tử vong.",
    image: "https://baogiaothong.mediacdn.vn/603483875699699712/2025/7/16/dn1-1752663517067301352398.jpg",
    date: "16/07/2025",
    link: "https://baoxaydung.vn/be-trai-tu-mien-nam-theo-gia-dinh-ve-que-tam-thac-den-bi-duoi-nuoc-tu-vong-192250716180229103.htm",
  },
  {
    id: 12,
    title: "Đắk Lắk: Tìm thấy người đàn ông đuối nước ở hồ Phú Xuân",
    description: "Ngày 15/7, ông Nguyễn Ngọc Tuấn, Chủ tịch Ủy ban nhân dân xã Xuân Phước, tỉnh Đắk Lắk xác nhận, đã tìm thấy thi thể người đàn ông bị đuối nước tại hồ chứa nước thủy lợi Phú Xuân lúc 10 giờ 30 phút cùng ngày.",
    image: "https://cdn.nhandan.vn/images/a18751b147ad6a48c74565099ca2eb9d7093c2d52d839dbc4d306ac71cc2f2a9bce5d8df1375d7c2dc9f247558cf1e77f746c6aa49d3d370a9c076951bc894af8fa2f4c863308048dc7f2c3e2854d97e78e72b56c5efc5e4b7980a83172a7883/z6805985037024-45c75e963f90f5bd0a1038f3157697b6-7615-1422.jpg",
    date: "15/07/2025",
    link: "https://nhandan.vn/dak-lak-tim-thay-nguoi-dan-ong-duoi-nuoc-o-ho-phu-xuan-post893802.html",
  },
  {
    id: 13,
    title: "Đi tắm sông cùng nhóm bạn, nam sinh lớp 6 đuối nước mất tích",
    description: "SKĐS - Trong quá trình đi tắm sông cùng nhóm bạn ở khu vực cống ông Bơ, cháu T.Q.H không may bị đuối nước mất tích và được lực lượng chức năng tìm thấy thi thể sau đó.",
    image: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2025/7/15/nuoc-17525458689822105006443.jpg",
    date: "15/07/2025",
    link: "https://suckhoedoisong.vn/di-tam-song-cung-nhom-ban-nam-sinh-lop-6-duoi-nuoc-mat-tich-169250715093028256.htm",
  },
  {
    id: 14,
    title: "TP.HCM: 2 bé trai ở xã Đông Thạnh đuối nước khi cùng bạn ra bờ sông chơi",
    description: "2 bé trai cùng nhóm bạn ra khu vực cầu Rạch Tra chơi. Trong đó, S. và L. không may trượt chân rơi xuống sông, đuối nước mất tích.",
    image: "data:image/jpeg;base64,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",
    date: "10/07/2025",
    link: "https://thanhnien.vn/tphcm-2-be-trai-o-xa-dong-thanh-duoi-nuoc-khi-cung-ban-ra-bo-song-choi-185250709200545995.htm",
  },
  {
    id: 15,
    title: "Lao xuống kênh cứu em, 2 anh em bị đuối nước",
    description: "Khi thấy em trai 4 tuổi rơi xuống kênh thủy lợi Ngàn Trươi ở Hà Tĩnh, người anh vội vàng lao xuống ứng cứu khiến cả hai anh em đều tử vong do bị đuối nước.",
    image: "https://images2.thanhnien.vn/528068263637045248/2025/6/29/edit-duoinuoc-17511621003271001075430.jpeg",
    date: "28/06/2025",
    link: "https://vnexpress.net/hai-anh-em-duoi-nuoc-khi-cuu-nhau-duoi-kenh-ngan-truoi-4907596.html",
  },
];
