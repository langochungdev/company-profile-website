export const mainLayoutConfig = {
    page: "main",
    pageName: "Layout Chính",
    path: "layout/main",
    icon: "mdi:page-layout-header-footer",
    order: 1,
    group: "Layout",

    sections: {
        topBar: {
            label: "Top Bar",
            component: "TopBar",
            enabled: true,
            collapsed: false,
            visible: true,
            fields: {
                address: { type: "text", label: "Địa chỉ", max: 100, default: "123 Đường ABC, Quận 1, TP.HCM" },
                email: { type: "text", label: "Email", max: 50, default: "info@sht.vn" },
                phone: { type: "text", label: "Số điện thoại", max: 20, default: "0901 234 567" },
            },
        },

        header: {
            label: "Header",
            component: "Header",
            enabled: true,
            collapsed: true,
            visible: true,
            fields: {
                logoUrl: { type: "image", label: "Logo", note: "Ảnh logo header" },
                ctaText: { type: "text", label: "Text nút CTA", default: "Báo Giá", max: 20 },
                navigation: {
                    type: "array",
                    label: "Menu điều hướng",
                    minItems: 1,
                    maxItems: 10,
                    sortable: true,
                    schema: {
                        label: { type: "text", label: "Tên menu", max: 30, required: true },
                        path: { type: "text", label: "Đường dẫn", max: 100, required: true },
                    },
                },
            },
        },

        footer: {
            label: "Footer",
            component: "Footer",
            enabled: true,
            collapsed: true,
            visible: true,
            fields: {
                brandName: { type: "text", label: "Tên thương hiệu", default: "SHT Security", max: 50 },
                brandHighlight: { type: "text", label: "Text highlight", default: "SHT", max: 20 },
                brandDescription: { type: "textarea", label: "Mô tả ngắn", max: 300, rows: 3 },
                quickLinks: {
                    type: "array",
                    label: "Liên kết nhanh",
                    minItems: 1,
                    maxItems: 8,
                    sortable: true,
                    schema: {
                        name: { type: "text", label: "Tên", max: 30, required: true },
                        path: { type: "text", label: "Đường dẫn", max: 100, required: true },
                    },
                },
                contactInfo: {
                    type: "array",
                    label: "Thông tin liên hệ",
                    minItems: 1,
                    maxItems: 6,
                    sortable: true,
                    schema: {
                        icon: { type: "text", label: "Icon (MDI)", note: "VD: mdi:phone" },
                        value: { type: "text", label: "Giá trị", max: 100, required: true },
                    },
                },
                socials: {
                    type: "array",
                    label: "Mạng xã hội",
                    minItems: 1,
                    maxItems: 6,
                    sortable: true,
                    schema: {
                        name: { type: "text", label: "Tên", max: 30, required: true },
                        icon: { type: "text", label: "Icon (MDI)", required: true },
                        url: { type: "text", label: "URL", max: 200, required: true },
                    },
                },
                mapAddress: { type: "text", label: "Địa chỉ bản đồ", max: 200 },
                mapEmbedUrl: { type: "textarea", label: "Google Maps Embed URL", rows: 3 },
                copyright: { type: "text", label: "Copyright", max: 100, default: "© 2024 SHT Security. All rights reserved." },
            },
        },

        zaloButton: {
            label: "Nút Zalo",
            component: "ZaloButton",
            enabled: true,
            collapsed: true,
            visible: true,
            fields: {
                phoneNumber: { type: "text", label: "Số điện thoại Zalo", max: 15, default: "0373763354" },
                imageUrl: { type: "image", label: "Icon Zalo", note: "Ảnh icon Zalo button" },
            },
        },
    },
};

export type MainLayoutConfig = typeof mainLayoutConfig;
