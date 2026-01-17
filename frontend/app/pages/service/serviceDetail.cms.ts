// Cấu hình chi tiết dịch vụ cho admin CRUD

import type { FieldConfig } from "@/pages/admin/page.config";

export interface ServiceDetailConfig {
    type: "detail";
    collection: string;
    collectionName: string;
    path: string;
    icon: string;

    itemFields: Record<string, FieldConfig>;
    tableColumns: Array<{ key: string; label: string; type: "text" | "image" | "badge" | "currency" | "date"; width?: number }>;
    defaultValues: Record<string, unknown>;
}

export const serviceDetailConfig: ServiceDetailConfig = {
    type: "detail",
    collection: "services",
    collectionName: "Chi tiết dịch vụ",
    path: "collections/services/items",
    icon: "mdi:briefcase",

    itemFields: {
        title: { type: "text", label: "Tên dịch vụ", max: 100, required: true, placeholder: "Nhập tên dịch vụ..." },
        slug: { type: "text", label: "Slug URL", max: 100, note: "Tự động tạo từ tên nếu để trống" },
        category: { type: "select", label: "Danh mục", options: ["Camera", "Hạ Tầng Mạng", "WiFi", "Kiểm Soát", "An Toàn", "Viễn Thông"], required: true },
        price: { type: "text", label: "Giá", max: 50, note: "VD: Từ 8.500.000đ" },
        description: { type: "textarea", label: "Mô tả ngắn", max: 300, rows: 3, placeholder: "Mô tả ngắn gọn về dịch vụ..." },
        content: { type: "richtext", label: "Nội dung chi tiết", placeholder: "Nhập nội dung chi tiết dịch vụ..." },
        features: {
            type: "array",
            label: "Tính năng nổi bật",
            min: 1,
            max: 10,
            sortable: true,
            schema: {
                text: { type: "text", label: "Tính năng", max: 100, required: true },
            },
        },
        thumbnail: { type: "image", label: "Ảnh thumbnail", note: "800x450px, max 2MB", required: true },
        gallery: {
            type: "array",
            label: "Gallery",
            min: 0,
            max: 8,
            schema: {
                url: { type: "image", label: "Ảnh", note: "800x600px" },
                caption: { type: "text", label: "Chú thích", max: 100 },
            },
        },
        metaTitle: { type: "text", label: "Meta Title", max: 60, note: "Mặc định dùng tên dịch vụ" },
        metaDescription: { type: "textarea", label: "Meta Description", max: 160, rows: 2 },
    },

    tableColumns: [
        { key: "thumbnail", label: "", type: "image", width: 80 },
        { key: "title", label: "Tên dịch vụ", type: "text" },
        { key: "category", label: "Danh mục", type: "badge" },
        { key: "price", label: "Giá", type: "text" },
    ],

    defaultValues: {
        title: "",
        slug: "",
        category: "",
        price: "",
        description: "",
        content: "",
        features: [],
        thumbnail: "",
    },
};
