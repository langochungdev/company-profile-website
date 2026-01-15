export interface Service {
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    category: string;
    price: string;
    features: string[];
}

export const SERVICES: Service[] = [
    {
        id: "1",
        title: "Camera Giám Sát AI - Nhận Diện Thông Minh",
        slug: "camera-giam-sat-ai",
        description: "Hệ thống camera AI tích hợp nhận diện khuôn mặt, phát hiện xâm nhập, đếm người và phân tích hành vi theo thời gian thực.",
        thumbnail: "https://placehold.co/800x450/1e293b/ffffff/jpg?text=Camera+AI",
        category: "Camera",
        price: "Từ 8.500.000đ",
        features: ["Nhận diện khuôn mặt", "Phát hiện chuyển động", "Lưu trữ cloud", "Xem từ xa 24/7"],
    },
    {
        id: "2",
        title: "Hệ Thống Mạng LAN Doanh Nghiệp",
        slug: "he-thong-mang-lan-doanh-nghiep",
        description: "Thiết kế và triển khai hạ tầng mạng LAN chuẩn Enterprise với cáp quang, switch quản lý và bảo mật toàn diện.",
        thumbnail: "https://placehold.co/800x450/0284c7/ffffff/jpg?text=Mang+LAN",
        category: "Hạ Tầng Mạng",
        price: "Từ 25.000.000đ",
        features: ["Cáp quang Cat6A", "Switch quản lý Layer 3", "Tốc độ 10Gbps", "Bảo hành 5 năm"],
    },
    {
        id: "3",
        title: "WiFi 7 Tốc Độ Cao - Pokémon Go",
        slug: "wifi-7-toc-do-cao",
        description: "Giải pháp WiFi 7 mới nhất, hỗ trợ hàng nghìn thiết bị đồng thời với tốc độ vượt trội và độ trễ cực thấp.",
        thumbnail: "https://placehold.co/800x450/0f766e/ffffff/jpg?text=WiFi+7",
        category: "WiFi",
        price: "Từ 15.000.000đ",
        features: ["Tốc độ 46Gbps", "Hỗ trợ 1000+ thiết bị", "Mesh tự động", "Roaming liền mạch"],
    },
    {
        id: "4",
        title: "Kiểm Soát Ra Vào Sinh Trắc Học",
        slug: "kiem-soat-ra-vao-sinh-trac-hoc",
        description: "Hệ thống Access Control thế hệ mới: nhận diện khuôn mặt, vân tay, thẻ từ và tích hợp chấm công tự động.",
        thumbnail: "https://placehold.co/800x450/7c3aed/ffffff/jpg?text=Access+Control",
        category: "Kiểm Soát",
        price: "Từ 12.000.000đ",
        features: ["Nhận diện khuôn mặt 3D", "Vân tay siêu âm", "Chấm công tự động", "Báo cáo chi tiết"],
    },
    {
        id: "5",
        title: "Hệ Thống Báo Cháy Thông Minh",
        slug: "he-thong-bao-chay-thong-minh",
        description: "Giải pháp phòng cháy chữa cháy đạt chuẩn PCCC Việt Nam với cảm biến thông minh, cảnh báo sớm và kết nối trung tâm.",
        thumbnail: "https://placehold.co/800x450/dc2626/ffffff/jpg?text=Bao+Chay",
        category: "An Toàn",
        price: "Từ 35.000.000đ",
        features: ["Cảm biến nhiệt đa vùng", "Báo động tự động", "Phun nước tự động", "Chuẩn PCCC VN"],
    },
    {
        id: "6",
        title: "Tổng Đài IP Cloud - Liên Lạc Doanh Nghiệp",
        slug: "tong-dai-ip-cloud",
        description: "Hệ thống tổng đài IP thông minh cho doanh nghiệp: cuộc gọi HD, ghi âm tự động, IVR và tích hợp CRM.",
        thumbnail: "https://placehold.co/800x450/475569/ffffff/jpg?text=Tong+Dai+IP",
        category: "Viễn Thông",
        price: "Từ 18.000.000đ",
        features: ["Gọi HD không giới hạn", "Ghi âm tự động", "IVR thông minh", "Tích hợp CRM"],
    },
];

export const SERVICE_CATEGORIES = ["Tất cả", "Camera", "Hạ Tầng Mạng", "WiFi", "Kiểm Soát", "An Toàn", "Viễn Thông"];
