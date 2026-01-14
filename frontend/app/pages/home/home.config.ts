// Cấu hình trang chủ cho admin panel

export const homeConfig = {
    page: "home",
    pageName: "Trang chủ",
    path: "pages/home",
    icon: "mdi:home",
    order: 1,

    sections: {
        hero: {
            label: "Banner Slideshow",
            collapsed: false,
            fields: {
                slides: {
                    type: "array",
                    label: "Danh sách slide",
                    min: 1,
                    max: 5,
                    sortable: true,
                    schema: {
                        badge: { type: "text", label: "Badge", max: 50, note: "VD: Giải Pháp An Ninh Toàn Diện" },
                        title: { type: "text", label: "Tiêu đề", max: 50, required: true },
                        highlight: { type: "text", label: "Text highlight", max: 50, note: "Phần text sẽ được tô màu" },
                        description: { type: "textarea", label: "Mô tả", max: 200, rows: 3 },
                        image: { type: "image", label: "Ảnh nền", note: "1920x1080, max 5MB", required: true },
                    },
                },
                ctaButtons: {
                    type: "group",
                    label: "Nút CTA",
                    fields: {
                        primaryText: { type: "text", label: "Text nút chính", default: "Liên Hệ Ngay", max: 30 },
                        primaryLink: { type: "text", label: "Link nút chính", note: "VD: /lien-he" },
                        secondaryText: { type: "text", label: "Text nút phụ", default: "Tìm Hiểu Thêm", max: 30 },
                        secondaryLink: { type: "text", label: "Link nút phụ", note: "VD: /gioi-thieu" },
                    },
                },
                visualImage: { type: "image", label: "Ảnh minh họa", note: "Ảnh sản phẩm bên phải slide" },
            },
        },

        services: {
            label: "Lĩnh Vực Hoạt Động",
            collapsed: true,
            fields: {
                sectionTitle: { type: "text", label: "Tiêu đề section", default: "Các Hạng Mục", max: 50 },
                highlightText: { type: "text", label: "Text highlight", default: "Thi Công", max: 30 },
                ctaText: { type: "text", label: "Text nút CTA", default: "XEM TẤT CẢ GIẢI PHÁP", max: 30 },
                ctaLink: { type: "text", label: "Link nút CTA", note: "VD: /dich-vu" },
                items: {
                    type: "array",
                    label: "Danh sách dịch vụ",
                    min: 4,
                    max: 8,
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
            collapsed: true,
            fields: {
                badge: { type: "text", label: "Badge", default: "Hồ sơ năng lực", max: 30 },
                sectionTitle: { type: "text", label: "Tiêu đề section", default: "Dự Án Hạ Tầng Đã làm", max: 50 },
                description: { type: "textarea", label: "Mô tả section", max: 300, rows: 3 },
                ctaText: { type: "text", label: "Text nút CTA", default: "XEM TẤT CẢ DỰ ÁN", max: 30 },
                ctaLink: { type: "text", label: "Link nút CTA", note: "VD: /du-an" },
                items: {
                    type: "array",
                    label: "Danh sách dự án",
                    min: 3,
                    max: 6,
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
                        stats: {
                            type: "array",
                            label: "Thống kê",
                            min: 0,
                            max: 3,
                            schema: {
                                value: { type: "text", label: "Giá trị", max: 20, note: "VD: 10Gbps, 99.9%" },
                                label: { type: "text", label: "Nhãn", max: 30, note: "VD: Băng thông, Uptime" },
                            },
                        },
                    },
                },
            },
        },

        certificates: {
            label: "Chứng Nhận",
            collapsed: true,
            fields: {
                sectionTitle: { type: "text", label: "Tiêu đề section", default: "Giấy Chứng Nhận & Chứng Chỉ", max: 50 },
                subtitle: { type: "text", label: "Phụ đề", default: "Uy tín & Chất lượng được công nhận", max: 100 },
                items: {
                    type: "array",
                    label: "Danh sách chứng nhận",
                    min: 1,
                    max: 20,
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
            collapsed: true,
            fields: {
                sectionTitle: { type: "text", label: "Tiêu đề section", default: "Đối Tác Tin Cậy", max: 50 },
                subtitle: { type: "text", label: "Phụ đề", default: "Hợp tác cùng các thương hiệu hàng đầu", max: 100 },
                items: {
                    type: "array",
                    label: "Danh sách đối tác",
                    min: 1,
                    max: 30,
                    sortable: true,
                    schema: {
                        logo: { type: "image", label: "Logo đối tác", note: "Logo thương hiệu, nền trong suốt", required: true },
                        name: { type: "text", label: "Tên đối tác", max: 50 },
                        link: { type: "text", label: "Link website", note: "VD: https://dahua.com" },
                    },
                },
            },
        },

        seo: {
            label: "SEO & Meta Tags",
            collapsed: true,
            fields: {
                title: { type: "text", label: "Meta Title", max: 60, required: true, note: "Tối đa 60 ký tự để hiển thị đầy đủ trên Google" },
                description: { type: "textarea", label: "Meta Description", max: 160, rows: 3, required: true, note: "Tối đa 160 ký tự" },
                keywords: { type: "text", label: "Keywords", note: "Ngăn cách bởi dấu phẩy. VD: camera an ninh, hạ tầng mạng" },
                ogTitle: { type: "text", label: "OG Title", max: 60, note: "Để trống sẽ dùng Meta Title" },
                ogDescription: { type: "textarea", label: "OG Description", max: 160, rows: 3, note: "Để trống sẽ dùng Meta Description" },
                ogImage: { type: "image", label: "Open Graph Image", note: "1200x630px cho Facebook/Twitter share", required: true },
                ogUrl: { type: "text", label: "OG URL", note: "URL trang. VD: https://sht.langochung.me" },
                noindex: { type: "boolean", label: "No Index", default: false, note: "Bật để ngăn Google index trang này" },
                nofollow: { type: "boolean", label: "No Follow", default: false, note: "Bật để ngăn Google follow links" },
            },
        },
    },
};

export type HomeConfig = typeof homeConfig;
