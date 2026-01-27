export const contactConfig = {
    page: "contact",
    pageName: "Liên hệ",
    path: "pages/contact",
    icon: "mdi:phone-outline",
    order: 6,
    group: "Trang",
    componentBase: "(components)",

    sections: {
        content: {
            label: "Nội dung trang Liên hệ",
            component: "ContactForm",
            enabled: true,
            collapsed: false,
            visible: true,
            fields: {
                info: {
                    type: "group",
                    label: "Thông tin liên hệ",
                    fields: {
                        title: { type: "text", label: "Tiêu đề", default: "Thông Tin Liên Hệ", max: 50 },
                        items: {
                            type: "array",
                            label: "Danh sách thông tin",
                            exact: 4,
                            sortable: true,
                            schema: {
                                label: { type: "text", label: "Nhãn", max: 30, required: true },
                                value: { type: "text", label: "Giá trị", max: 100, required: true },
                                icon: { type: "text", label: "Icon (MDI)", note: "VD: mdi:phone" },
                            },
                        },
                    },
                },
                socials: {
                    type: "group",
                    label: "Mạng xã hội",
                    fields: {
                        items: {
                            type: "array",
                            label: "Danh sách mạng xã hội",
                            minItems: 1,
                            maxItems: 6,
                            sortable: true,
                            schema: {
                                name: { type: "text", label: "Tên", max: 30, required: true },
                                icon: { type: "text", label: "Icon (MDI)", note: "VD: mdi:facebook" },
                                url: { type: "text", label: "URL", max: 200, required: true },
                            },
                        },
                    },
                },
                map: {
                    type: "group",
                    label: "Bản đồ",
                    fields: {
                        title: { type: "text", label: "Tiêu đề", default: "Vị Trí Văn Phòng", max: 50 },
                        embedUrl: { type: "textarea", label: "Google Maps Embed URL", rows: 3, max: 500 },
                    },
                },
            },
        },
    },
};

export type ContactConfig = typeof contactConfig;
