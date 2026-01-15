// Cấu hình trang bài viết cho admin panel

import { postDetailConfig } from "./postDetail.config";

export interface Post {
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    category: string;
    author: string;
    publishedAt: string;
}

export const POSTS: Post[] = [
    {
        id: "1",
        title: "Xu hướng Camera AI năm 2026: Đột phá công nghệ giám sát",
        slug: "xu-huong-camera-ai-2026",
        description: "Khám phá những công nghệ camera AI mới nhất giúp nhận diện khuôn mặt, hành vi và phân tích dữ liệu theo thời gian thực.",
        thumbnail: "https://placehold.co/800x450/1e293b/ffffff/jpg?text=Camera+AI+2026",
        category: "Công Nghệ",
        author: "Nguyễn Văn A",
        publishedAt: "14/01/2026",
    },
    {
        id: "2",
        title: "Giải pháp WiFi 7 cho doanh nghiệp: Tốc độ và bảo mật",
        slug: "giai-phap-wifi-7-doanh-nghiep",
        description: "WiFi 7 mang lại tốc độ vượt trội và khả năng kết nối hàng nghìn thiết bị, giải quyết bài toán mạng cho văn phòng lớn.",
        thumbnail: "https://placehold.co/800x450/0f766e/ffffff/jpg?text=WiFi+7+Enterprise",
        category: "Hạ Tầng Mạng",
        author: "Trần Thị B",
        publishedAt: "12/01/2026",
    },
    {
        id: "3",
        title: "Hệ thống báo cháy thông minh: Đầu tư cho sự an toàn",
        slug: "he-thong-bao-chay-thong-minh",
        description: "Tại sao doanh nghiệp cần nâng cấp lên hệ thống báo cháy thông minh? Lợi ích và chi phí đầu tư.",
        thumbnail: "https://placehold.co/800x450/dc2626/ffffff/jpg?text=Bao+Chay+Smart",
        category: "An Ninh",
        author: "Lê Văn C",
        publishedAt: "10/01/2026",
    },
    {
        id: "4",
        title: "Access Control: Kiểm soát ra vào hiệu quả",
        slug: "access-control-hieu-qua",
        description: "Các giải pháp kiểm soát ra vào bằng vân tay, thẻ từ và khuôn mặt phổ biến nhất hiện nay.",
        thumbnail: "https://placehold.co/800x450/7c3aed/ffffff/jpg?text=Access+Control",
        category: "Giải Pháp",
        author: "Phạm Văn D",
        publishedAt: "05/01/2026",
    },
    {
        id: "5",
        title: "Lắp đặt mạng LAN chuẩn Enterprise cho tòa nhà",
        slug: "lap-dat-mang-lan-enterprise",
        description: "Quy trình thiết kế và thi công hệ thống mạng LAN tiêu chuẩn Enterprise đảm bảo ổn định 24/7.",
        thumbnail: "https://placehold.co/800x450/0284c7/ffffff/jpg?text=Mang+LAN+Enterprise",
        category: "Hạ Tầng Mạng",
        author: "Hoàng Văn E",
        publishedAt: "02/01/2026",
    },
    {
        id: "6",
        title: "Tổng đài IP: Giải pháp liên lạc tiết kiệm chi phí",
        slug: "tong-dai-ip-tiet-kiem",
        description: "So sánh tổng đài analog và tổng đài IP. Tại sao doanh nghiệp nên chuyển đổi số hệ thống liên lạc.",
        thumbnail: "https://placehold.co/800x450/475569/ffffff/jpg?text=Tong+Dai+IP",
        category: "Viễn Thông",
        author: "Ngô Thị F",
        publishedAt: "28/12/2025",
    },
];

export const POST_CATEGORIES = ["Tất cả", "Công Nghệ", "Hạ Tầng Mạng", "An Ninh", "Giải Pháp", "Viễn Thông"];

export const postPageConfig = {
    page: "post",
    pageName: "Bài viết",
    path: "pages/post",
    icon: "mdi:post-outline",
    order: 4,
    group: "Trang",

    type: "collection" as const,
    itemConfig: {
        name: "bài viết",
        namePlural: "Bài viết",
        icon: "mdi:post-outline",
        config: postDetailConfig,
        data: POSTS,
    },

    sections: {
        settings: {
            label: "Cài đặt trang",
            collapsed: false,
            fields: {
                pageTitle: {
                    type: "text",
                    label: "Tiêu đề trang",
                    max: 60,
                    default: "Tin Tức",
                },
                pageDescription: {
                    type: "textarea",
                    label: "Mô tả trang",
                    max: 200,
                    rows: 3,
                },
                postsPerPage: {
                    type: "number",
                    label: "Số bài/trang",
                    min: 6,
                    max: 24,
                    default: 9,
                },
            },
        },

        seo: {
            label: "SEO & Meta Tags",
            collapsed: true,
            fields: {
                title: { type: "text", label: "Meta Title", max: 60 },
                description: { type: "textarea", label: "Meta Description", max: 160, rows: 3 },
                ogImage: { type: "image", label: "OG Image", note: "1200x630px" },
            },
        },
    },
};

export type PostPageConfig = typeof postPageConfig;
