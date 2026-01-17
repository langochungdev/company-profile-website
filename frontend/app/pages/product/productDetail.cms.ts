// Cấu hình chi tiết sản phẩm cho admin CRUD

import type { FieldConfig } from "@/pages/admin/page.config";

export interface ProductDetailConfig {
    type: "detail";
    collection: string;
    collectionName: string;
    path: string;
    icon: string;

    itemFields: Record<string, FieldConfig>;
    tableColumns: Array<{ key: string; label: string; type: "text" | "image" | "badge" | "currency" | "date"; width?: number }>;
    defaultValues: Record<string, unknown>;
}

export const productDetailConfig: ProductDetailConfig = {
    type: "detail",
    collection: "products",
    collectionName: "Chi tiết sản phẩm",
    path: "collections/products/items",
    icon: "mdi:package-variant",

    itemFields: {
        name: { type: "text", label: "Tên sản phẩm", max: 100, required: true, placeholder: "Nhập tên sản phẩm..." },
        slug: { type: "text", label: "Slug URL", max: 100, note: "Tự động tạo từ tên nếu để trống" },
        category: { type: "select", label: "Danh mục", options: ["Camera AI", "WiFi Doanh Nghiệp", "Switch & Router", "Báo Cháy", "Access Control"], required: true },
        price: { type: "number", label: "Giá (VNĐ)", min: 0, note: "Để trống nếu liên hệ" },
        badge: { type: "select", label: "Badge", options: ["", "Best Seller", "New", "Hot", "Sale"], note: "Hiển thị góc sản phẩm" },
        description: { type: "textarea", label: "Mô tả ngắn", max: 300, rows: 3, placeholder: "Mô tả ngắn gọn về sản phẩm..." },
        content: { type: "richtext", label: "Nội dung chi tiết", placeholder: "Nhập nội dung chi tiết sản phẩm..." },
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
        image: { type: "image", label: "Ảnh chính", note: "800x800px, max 2MB", required: true },
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
        metaTitle: { type: "text", label: "Meta Title", max: 60, note: "Mặc định dùng tên sản phẩm" },
        metaDescription: { type: "textarea", label: "Meta Description", max: 160, rows: 2 },
    },

    tableColumns: [
        { key: "image", label: "", type: "image", width: 60 },
        { key: "name", label: "Tên sản phẩm", type: "text" },
        { key: "category", label: "Danh mục", type: "badge" },
        { key: "price", label: "Giá", type: "currency" },
        { key: "badge", label: "Badge", type: "badge" },
    ],

    defaultValues: {
        name: "",
        slug: "",
        category: "",
        price: 0,
        badge: "",
        description: "",
        features: [],
        image: "",
    },
};
