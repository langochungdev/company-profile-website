// Cấu hình chi tiết bài viết cho admin CRUD

export const postDetailConfig = {
    sections: {
        basic: {
            label: "Thông tin cơ bản",
            collapsed: false,
            fields: {
                title: {
                    type: "text",
                    label: "Tiêu đề bài viết",
                    max: 150,
                    required: true,
                    placeholder: "Nhập tiêu đề bài viết...",
                },
                slug: {
                    type: "text",
                    label: "Slug URL",
                    max: 100,
                    note: "Tự động tạo từ tiêu đề nếu để trống",
                },
                category: {
                    type: "select",
                    label: "Danh mục",
                    options: ["Công Nghệ", "Hạ Tầng Mạng", "An Ninh", "Giải Pháp", "Viễn Thông"],
                    required: true,
                },
                author: {
                    type: "text",
                    label: "Tác giả",
                    max: 50,
                    required: true,
                },
                publishedAt: {
                    type: "text",
                    label: "Ngày đăng",
                    note: "DD/MM/YYYY",
                },
                status: {
                    type: "select",
                    label: "Trạng thái",
                    options: ["draft", "published"],
                    default: "draft",
                },
            },
        },

        content: {
            label: "Nội dung",
            collapsed: false,
            fields: {
                description: {
                    type: "textarea",
                    label: "Mô tả ngắn",
                    max: 300,
                    rows: 3,
                    placeholder: "Mô tả ngắn hiển thị ở danh sách...",
                },
                content: {
                    type: "richtext",
                    label: "Nội dung bài viết",
                    placeholder: "Nhập nội dung bài viết...",
                },
            },
        },

        media: {
            label: "Hình ảnh",
            collapsed: true,
            fields: {
                thumbnail: {
                    type: "image",
                    label: "Ảnh thumbnail",
                    note: "800x450px, max 2MB",
                    required: true,
                },
            },
        },

        seo: {
            label: "SEO",
            collapsed: true,
            fields: {
                metaTitle: {
                    type: "text",
                    label: "Meta Title",
                    max: 60,
                    note: "Mặc định dùng tiêu đề bài viết",
                },
                metaDescription: {
                    type: "textarea",
                    label: "Meta Description",
                    max: 160,
                    rows: 2,
                },
            },
        },
    },

    tableColumns: [
        { key: "thumbnail", label: "", type: "image", width: 80 },
        { key: "title", label: "Tiêu đề", type: "text" },
        { key: "category", label: "Danh mục", type: "badge" },
        { key: "author", label: "Tác giả", type: "text" },
        { key: "publishedAt", label: "Ngày đăng", type: "text" },
    ],

    defaultValues: {
        title: "",
        slug: "",
        category: "",
        author: "",
        publishedAt: "",
        status: "draft",
        description: "",
        content: "",
        thumbnail: "",
    },
};

export type PostDetailConfig = typeof postDetailConfig;
