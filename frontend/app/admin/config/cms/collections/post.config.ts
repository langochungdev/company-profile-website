export const postConfig = {
    type: "detail" as const,
    collection: "posts",
    collectionName: "Bài viết",
    path: "collections/posts/items",
    icon: "mdi:post",
    order: 3,
    group: "Trang",

    seo: {
        listingTitle: "Tin Tức & Kiến Thức",
        listingDesc: "Cập nhật tin tức mới nhất về công nghệ an ninh, camera AI, hạ tầng mạng doanh nghiệp, giải pháp WiFi và kiểm soát ra vào.",
        titleField: "title",
        descField: "excerpt",
        imageField: "thumbnail.url",
    },
    itemFields: {
        title: { type: "text", label: "Tiêu đề", isPreview: true },
        slug: { type: "text", label: "Slug", isPreview: true },
        category: { type: "text", label: "Danh mục", isPreview: true },
        tags: { type: "dynamic-multi-select", label: "Tags", isPreview: true, previewCount: 3 },
        excerpt: { type: "textarea", label: "Tóm tắt", isPreview: true, previewMaxLength: 200 },
        thumbnail: { type: "image", label: "Ảnh đại diện", isPreview: true },
        author: { type: "text", label: "Tác giả", isPreview: true },
        publishedAt: { type: "date", label: "Ngày xuất bản", isPreview: true },
        featured: { type: "boolean", label: "Nổi bật", isPreview: true },
        status: { type: "text", label: "Trạng thái", isPreview: true },
        content: { type: "richtext", label: "Nội dung" },
    },
};

export type PostConfig = typeof postConfig;
