export const aboutUsConfig = {
    page: "about-us",
    pageName: "Giới thiệu",
    path: "pages/about-us",
    icon: "mdi:information-outline",
    order: 5,
    group: "Trang",
    componentBase: "(components)",

    sections: {
        content: {
            label: "Nội dung trang Giới thiệu",
            component: "AboutContent",
            enabled: true,
            collapsed: false,
            visible: true,
            fields: {
                hero: {
                    type: "group",
                    label: "Hero Section",
                    fields: {
                        title: { type: "text", label: "Tiêu đề chính", default: "Câu Chuyện", max: 30 },
                        highlight: { type: "text", label: "Text highlight", default: "SHT Security", max: 30 },
                        description: { type: "textarea", label: "Mô tả", max: 200, rows: 3 },
                    },
                },
                intro: {
                    type: "group",
                    label: "Giới thiệu",
                    fields: {
                        image: { type: "image", label: "Ảnh đội ngũ", note: "800x600" },
                        experienceYears: { type: "text", label: "Số năm kinh nghiệm", default: "10+", max: 10 },
                        experienceText: { type: "text", label: "Text năm kinh nghiệm", default: "Năm Kinh Nghiệm", max: 30 },
                        sectionTitle: { type: "text", label: "Tiêu đề section", default: "Về Chúng Tôi", max: 50 },
                        descriptions: {
                            type: "array",
                            label: "Các đoạn mô tả",
                            minItems: 1,
                            maxItems: 5,
                            schema: {
                                text: { type: "textarea", label: "Nội dung", max: 500, rows: 4 },
                            },
                        },
                    },
                },
                stats: {
                    type: "group",
                    label: "Thống kê",
                    fields: {
                        items: {
                            type: "array",
                            label: "Danh sách thống kê",
                            exact: 4,
                            sortable: true,
                            schema: {
                                value: { type: "text", label: "Giá trị", max: 20, required: true },
                                label: { type: "text", label: "Nhãn", max: 50, required: true },
                                icon: { type: "text", label: "Icon (MDI)", note: "VD: mdi:check-decagram" },
                            },
                        },
                    },
                },
                values: {
                    type: "group",
                    label: "Giá trị cốt lõi",
                    fields: {
                        sectionTitle: { type: "text", label: "Tiêu đề", default: "Giá Trị", max: 30 },
                        highlightText: { type: "text", label: "Text highlight", default: "Cốt Lõi", max: 30 },
                        items: {
                            type: "array",
                            label: "Danh sách giá trị",
                            exact: 4,
                            sortable: true,
                            schema: {
                                title: { type: "text", label: "Tiêu đề", max: 30, required: true },
                                description: { type: "textarea", label: "Mô tả", max: 200, rows: 2 },
                                icon: { type: "text", label: "Icon (MDI)", note: "VD: mdi:shield-check" },
                            },
                        },
                    },
                },
                cta: {
                    type: "group",
                    label: "Call to Action",
                    fields: {
                        title: { type: "text", label: "Tiêu đề", default: "Bạn Cần Tư Vấn?", max: 50 },
                        description: { type: "text", label: "Mô tả", max: 100 },
                        buttonText: { type: "text", label: "Text nút", default: "Liên Hệ Ngay", max: 30 },
                        buttonLink: { type: "text", label: "Link nút", default: "/contact", max: 100 },
                    },
                },
            },
        },
    },
};

export type AboutUsConfig = typeof aboutUsConfig;
