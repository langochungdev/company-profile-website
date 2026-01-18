// Cấu hình chi tiết bài viết cho admin CRUD

import type { FieldConfig } from "~/pages/admin/config/page.config";

export interface PostDetailConfig {
    type: "detail";
    collection: string;
    collectionName: string;
    path: string;
    icon: string;

    itemFields: Record<string, FieldConfig>;
    tableColumns: Array<{ key: string; label: string; type: "text" | "image" | "badge" | "currency" | "date"; width?: number }>;
    defaultValues: Record<string, unknown>;
}

export const postDetailConfig: PostDetailConfig = {
    type: "detail",
    collection: "posts",
    collectionName: "Chi tiết bài viết",
    path: "collections/posts/items",
    icon: "mdi:post-outline",

    itemFields: {
        title: { type: "text", label: "Tiêu đề bài viết", max: 150, required: true, placeholder: "Nhập tiêu đề bài viết..." },
        slug: { type: "text", label: "Slug URL", max: 100, note: "Tự động tạo từ tiêu đề nếu để trống" },
        category: { type: "select", label: "Danh mục", options: ["Công Nghệ", "Hạ Tầng Mạng", "An Ninh", "Giải Pháp", "Viễn Thông"], required: true },
        author: { type: "text", label: "Tác giả", max: 50, required: true },
        publishedAt: { type: "text", label: "Ngày đăng", note: "DD/MM/YYYY" },
        status: { type: "select", label: "Trạng thái", options: ["draft", "published"], default: "draft" },
        description: { type: "textarea", label: "Mô tả ngắn", max: 300, rows: 3, placeholder: "Mô tả ngắn hiển thị ở danh sách..." },
        content: { type: "richtext", label: "Nội dung bài viết", placeholder: "Nhập nội dung bài viết..." },
        thumbnail: { type: "image", label: "Ảnh thumbnail", note: "800x450px, max 2MB", required: true },
        metaTitle: { type: "text", label: "Meta Title", max: 60, note: "Mặc định dùng tiêu đề bài viết" },
        metaDescription: { type: "textarea", label: "Meta Description", max: 160, rows: 2 },
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
