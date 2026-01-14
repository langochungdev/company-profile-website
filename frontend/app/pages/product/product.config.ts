export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    category: string;
    price?: number;
    features: string[];
    badge?: string;
}

export const PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Camera AI Nhận Diện Khuôn Mặt SHT-Pro",
        slug: "camera-ai-sht-pro",
        description: "Camera thông minh tích hợp AI Deep Learning, nhận diện khuôn mặt chính xác 99%, cảnh báo người lạ.",
        image: "https://placehold.co/400x400/1e293b/ffffff/png?text=Camera+AI",
        category: "Camera AI",
        price: 2500000,
        features: ["Độ phân giải 4K", "AI Face ID", "Đàm thoại 2 chiều", "Hồng ngoại 30m"],
        badge: "Best Seller",
    },
    {
        id: "2",
        name: "WiFi 6 Access Point Enterprise",
        slug: "wifi-6-enterprise",
        description: "Bộ phát WiFi 6 chuẩn công nghiệp, chịu tải 500+ user, hỗ trợ Roaming mượt mà cho văn phòng rộng.",
        image: "https://placehold.co/400x400/0f766e/ffffff/png?text=WiFi+6",
        category: "WiFi Doanh Nghiệp",
        price: 4500000,
        features: ["Chuẩn AX3000", "MU-MIMO", "Cloud Controller", "PoE+"],
        badge: "New",
    },
    {
        id: "3",
        name: "Switch PoE 24 Port Gigabit",
        slug: "switch-poe-24-port",
        description: "Switch quản lý Layer 2, 24 cổng PoE+ cấp nguồn cho Camera và WiFi, tổng công suất 370W.",
        image: "https://placehold.co/400x400/7c3aed/ffffff/png?text=Switch+PoE",
        category: "Switch & Router",
        features: ["24x Gigabit PoE+", "4x SFP Uplink", "VLAN/QoS", "Web Managed"],
    },
    {
        id: "4",
        name: "Trung Tâm Báo Cháy Địa Chỉ 4 Loop",
        slug: "bao-chay-dia-chi-4-loop",
        description: "Tủ trung tâm báo cháy địa chỉ thông minh, quản lý 1000 thiết bị, màn hình cảm ứng LCD.",
        image: "https://placehold.co/400x400/dc2626/ffffff/png?text=Bao+Chay",
        category: "Báo Cháy",
        features: ["4 Loop", "Màn hình LCD", "Lưu ký sự kiện", "Kết nối PC"],
    },
    {
        id: "5",
        name: "Máy Chấm Công & Kiểm Soát Cửa FaceID",
        slug: "may-cham-cong-faceid",
        description: "Thiết bị chấm công nhận diện khuôn mặt, vân tay và thẻ từ. Tốc độ nhận diện <0.5s.",
        image: "https://placehold.co/400x400/0284c7/ffffff/png?text=Access+Control",
        category: "Access Control",
        price: 3200000,
        features: ["Face ID", "Vân tay", "Thẻ từ", "Kết nối qua App"],
        badge: "Hot",
    },
    {
        id: "6",
        name: "Router Cân Bằng Tải Multi-WAN",
        slug: "router-load-balance",
        description: "Router chịu tải cao cho doanh nghiệp, gộp băng thông 4 đường truyền Internet, VPN bảo mật.",
        image: "https://placehold.co/400x400/475569/ffffff/png?text=Router+VPN",
        category: "Switch & Router",
        features: ["4 WAN", "VPN Server", "Firewall", "Quản lý tập trung"],
    },
];

export const PRODUCT_CATEGORIES = ["Tất cả", "Camera AI", "WiFi Doanh Nghiệp", "Switch & Router", "Báo Cháy", "Access Control"];
