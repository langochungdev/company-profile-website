export const homeConfig = {
    page: "home",
    pageName: "Trang chủ",
    path: "pages/home",
    icon: "mdi:home",
    order: 1,
    group: "Trang",
    componentBase: "components",
    schemaType: "home",

    sections: {
        hero: {
            label: "Banner Slideshow",
            component: "HeroSection",
            enabled: true,
            collapsed: false,
            visible: true,
            fields: {
                slides: {
                    type: "array",
                    label: "Danh sách slide",
                    exact: 3,
                    sortable: true,
                    schema: {
                        badge: { type: "text", label: "Badge", max: 50, note: "VD: Giải Pháp An Ninh Toàn Diện" },
                        title: { type: "text", label: "Tiêu đề", max: 50, required: true },
                        highlight: { type: "text", label: "Text highlight", max: 50, note: "Phần text sẽ được tô màu" },
                        description: { type: "textarea", label: "Mô tả", max: 200, rows: 3 },
                        image: { type: "image", label: "Ảnh nền", note: "1920x1080, max 5MB", required: true },
                    },
                },
            },
        },

        services: {
            label: "Lĩnh Vực Hoạt Động",
            component: "ServicesSection",
            enabled: true,
            collapsed: true,
            visible: true,
            fields: {
                sectionTitle: { type: "text", label: "Tiêu đề section", default: "Các Hạng Mục", max: 50 },
                highlightText: { type: "text", label: "Text highlight", default: "Thi Công", max: 30 },
                items: {
                    type: "array",
                    label: "Danh sách dịch vụ",
                    exact: 8,
                    sortable: true,
                    schema: {
                        title: { type: "text", label: "Tên dịch vụ", max: 50, required: true },
                        description: { type: "textarea", label: "Mô tả", max: 200, rows: 3 },
                        icon: { type: "text", label: "Icon (MDI)", note: "VD: mdi:face-recognition, mdi:lan" },
                        image: { type: "image", label: "Ảnh nền", note: "800x600" },
                        link: { type: "text", label: "Link chi tiết", note: "VD: /san-pham/camera-an-ninh" },
                    },
                },
            },
        },

        projects: {
            label: "Dự Án Tiêu Biểu",
            component: "ProjectSection",
            enabled: true,
            collapsed: true,
            visible: true,
            fields: {
                badge: { type: "text", label: "Badge", default: "Hồ sơ năng lực", max: 30 },
                sectionTitle: { type: "text", label: "Tiêu đề section", default: "Dự Án Hạ Tầng Đã làm", max: 50 },
                description: { type: "textarea", label: "Mô tả section", max: 300, rows: 3 },
                items: {
                    type: "array",
                    label: "Danh sách dự án",
                    exact: 5,
                    sortable: true,
                    schema: {
                        title: { type: "text", label: "Tên dự án", max: 50, required: true },
                        titleHtml: { type: "text", label: "Tiêu đề HTML", max: 100, note: "Có thể dùng <br> để xuống dòng" },
                        category: { type: "text", label: "Danh mục", max: 30, note: "VD: DATA CENTER, CCTV & AI" },
                        badgeColor: { type: "select", label: "Màu badge", options: ["bg-cyan-400", "bg-emerald-400", "bg-purple-400", "bg-orange-400", "bg-pink-400"], default: "bg-cyan-400" },
                        location: { type: "text", label: "Địa điểm", max: 30 },
                        year: { type: "text", label: "Năm", max: 10 },
                        description: { type: "textarea", label: "Mô tả", max: 200, rows: 3 },
                        image: { type: "image", label: "Ảnh dự án", note: "800x600", required: true },
                        link: { type: "text", label: "Link chi tiết", note: "VD: /du-an/data-center-vng" },
                    },
                },
            },
        },

        blog: {
            label: "Kênh Truyền Thông",
            component: "BlogSection",
            enabled: false,
            collapsed: true,
            visible: true,
            fields: {
                sectionTitle: { type: "text", label: "Tiêu đề section", default: "CÁC KÊNH", max: 50 },
                highlightText: { type: "text", label: "Text highlight", default: "TRUYỀN THÔNG", max: 30 },
                socialLinks: {
                    type: "group",
                    label: "Social Media Links",
                    fields: {
                        tiktokUrl: { type: "text", label: "TikTok URL", default: "https://tiktok.com/@huyphan_sht_co.ltd", note: "Link TikTok profile" },
                        facebookUrl: { type: "text", label: "Facebook URL", default: "https://facebook.com/SHT.security", note: "Link Facebook page" },
                        youtubeUrl: { type: "text", label: "YouTube URL", default: "https://youtube.com/@SHTsecurity", note: "Link YouTube channel" },
                        facebookPageId: { type: "text", label: "Facebook Page ID", default: "https://www.facebook.com/SmartHomeTechnologySHT/", note: "Facebook Page URL cho embed widget" },
                    },
                },
                tiktokVideos: {
                    type: "array",
                    label: "Danh sách TikTok Videos",
                    exact: 3,
                    sortable: true,
                    schema: {
                        videoId: { type: "text", label: "Video ID", max: 50, required: true, note: "VD: 7479305993915026705" },
                        cite: { type: "text", label: "TikTok URL", max: 200, required: true, note: "VD: https://www.tiktok.com/@user/video/123456" },
                        username: { type: "text", label: "Username", max: 50, note: "VD: @huyphan_sht_co.ltd" },
                    },
                },
            },
        },

        news: {
            label: "Tin Tức & Kiến Thức",
            component: "NewsSection",
            enabled: true,
            collapsed: true,
            visible: true,
            fields: {
                sectionTitle: { type: "text", label: "Tiêu đề section", default: "Kiến Thức &", max: 50 },
                highlightText: { type: "text", label: "Text highlight", default: "Giải Pháp", max: 30 },
                items: {
                    type: "array",
                    label: "Danh sách tin tức nổi bật",
                    exact: 3,
                    sortable: true,
                    schema: {
                        title: { type: "text", label: "Tiêu đề bài viết", max: 100, required: true },
                        description: { type: "textarea", label: "Mô tả ngắn", max: 200, rows: 3 },
                        thumbnail: { type: "image", label: "Ảnh thumbnail", note: "800x600", required: true },
                        category: { type: "text", label: "Danh mục", max: 30, note: "VD: Camera AI, Hạ Tầng Mạng" },
                        publishedAt: { type: "text", label: "Ngày đăng", max: 20, note: "VD: 15/01/2025" },
                        link: { type: "text", label: "Link bài viết", note: "VD: /post/camera-ai-2026", required: true },
                    },
                },
            },
        },

        certificates: {
            label: "Chứng Nhận",
            component: "CertSection",
            enabled: true,
            collapsed: true,
            visible: true,
            fields: {
                sectionTitle: { type: "text", label: "Tiêu đề section", default: "Giấy Chứng Nhận &", max: 50 },
                highlightText: { type: "text", label: "Text highlight", default: "Chứng Chỉ", max: 30 },
                subtitle: { type: "text", label: "Phụ đề", default: "Uy tín & Chất lượng được công nhận", max: 100 },
                items: {
                    type: "array",
                    label: "Danh sách chứng nhận",
                    exact: 10,
                    sortable: true,
                    schema: {
                        image: { type: "image", label: "Ảnh chứng nhận", note: "Ảnh giấy chứng nhận/chứng chỉ", required: true },
                        title: { type: "text", label: "Tên chứng nhận", max: 100 },
                    },
                },
            },
        },

        partners: {
            label: "Đối Tác",
            component: "PartnerSection",
            enabled: true,
            collapsed: true,
            visible: true,
            fields: {
                sectionTitle: { type: "text", label: "Tiêu đề section", default: "Đối Tác", max: 50 },
                highlightText: { type: "text", label: "Text highlight", default: "Tin Cậy", max: 30 },
                subtitle: { type: "text", label: "Phụ đề", default: "Hợp tác cùng các thương hiệu hàng đầu", max: 100 },
                items: {
                    type: "array",
                    label: "Danh sách đối tác",
                    exact: 10,
                    sortable: true,
                    schema: {
                        logo: { type: "image", label: "Logo đối tác", note: "Logo thương hiệu, nền trong suốt", required: true },
                        name: { type: "text", label: "Tên đối tác", max: 50 },
                        link: { type: "text", label: "Link website", note: "VD: https://dahua.com" },
                    },
                },
            },
        },
    },
};

export type HomeConfig = typeof homeConfig;
