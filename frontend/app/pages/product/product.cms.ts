// Cấu hình chi tiết sản phẩm cho admin CRUD

import type { FieldConfig } from "~/admin/config/page.config";

interface SeoMapping {
    title: string;
    description: string;
    image: string;
}

interface SchemaMapping {
    name: string;
    description: string;
    image: string;
    gallery?: string;
    sku: string;
    price?: string;
    brand?: string;
    currency?: string;
}

interface ListingMeta {
    title: string;
    description: string;
}

export interface ProductDetailConfig {
    type: "detail";
    collection: string;
    collectionName: string;
    path: string;
    icon: string;
    schemaType?: string;
    listingSchemaType?: string;
    seoMapping?: SeoMapping;
    schemaMapping?: SchemaMapping;
    listingMeta?: ListingMeta;

    itemFields: Record<string, FieldConfig>;
    tableColumns: Array<{ key: string; label: string; type: "text" | "image" | "badge" | "currency" | "date"; width?: number }>;
    defaultValues: Record<string, unknown>;
}

export const productDetailConfig: ProductDetailConfig = {
    type: "detail",
    collection: "products",
    collectionName: "danh sách sản phẩm",
    path: "collections/products/items",
    icon: "mdi:package-variant",
    schemaType: "product",
    listingSchemaType: "productListing",

    seoMapping: {
        title: "name",
        description: "description",
        image: "image",
    },

    schemaMapping: {
        name: "name",
        description: "description",
        image: "image",
        gallery: "gallery",
        sku: "slug",
        price: "price",
        brand: "SHT Security",
        currency: "VND",
    },

    listingMeta: {
        title: "Sản Phẩm & Giải Pháp",
        description: "Danh mục sản phẩm an ninh, camera AI, thiết bị mạng WiFi doanh nghiệp, switch PoE, báo cháy và access control chính hãng.",
    },

    itemFields: {
        name: { type: "text", label: "Tên sản phẩm", max: 100, required: true, placeholder: "Nhập tên sản phẩm...", isPreview: true },
        slug: { type: "text", label: "Slug URL", max: 100, note: "Tự động tạo từ tên nếu để trống", isPreview: true },
        category: {
            type: "dynamic-select",
            label: "Danh mục",
            configKey: "categories",
            required: true,
            isPreview: true,
            note: "Quản lý danh mục trong nút 'Danh mục'",
        },
        tags: {
            type: "dynamic-multi-select",
            label: "Tags (Nhóm sản phẩm)",
            configKey: "tags",
            isPreview: true,
            previewCount: 3,
            note: "Quản lý tags trong nút 'Tags'",
        },
        price: { type: "number", label: "Giá (VNĐ)", min: 0, note: "Để trống nếu liên hệ", isPreview: true },
        description: { type: "textarea", label: "Tóm tắt", max: 500, rows: 4, placeholder: "Mô tả ngắn gọn về sản phẩm...", isPreview: true, previewMaxLength: 150 },
        image: { type: "image", label: "Ảnh chính", note: "800x800px, max 2MB", required: true, isPreview: true },
        media: {
            type: "array",
            label: "Media (Ảnh & Video)",
            min: 0,
            max: 10,
            sortable: true,
            note: "Thêm ảnh hoặc video (YouTube, TikTok, Facebook)",
            previewCount: 0,
            schema: {
                type: { type: "select", label: "Loại", options: ["image", "video"], default: "image", required: true },
                url: { type: "text", label: "URL", max: 500, required: true, note: "URL ảnh hoặc embed video (YouTube/TikTok/Facebook)" },
                caption: { type: "text", label: "Chú thích", max: 100 },
            },
        },
        content: { type: "richtext", label: "Bài viết chi tiết", placeholder: "Nội dung chi tiết sản phẩm (có thể nhúng video, bảng, media)..." },
        gallery: {
            type: "array",
            label: "Gallery ảnh phụ",
            min: 0,
            max: 8,
            previewCount: 0,
            schema: {
                url: { type: "image", label: "Ảnh", note: "800x600px" },
                caption: { type: "text", label: "Chú thích", max: 100 },
            },
        },
    },

    tableColumns: [
        { key: "image", label: "", type: "image", width: 60 },
        { key: "name", label: "Tên sản phẩm", type: "text" },
        { key: "category", label: "Danh mục", type: "badge" },
        { key: "price", label: "Giá", type: "currency" },
        { key: "tags", label: "Tags", type: "tags" },
        { key: "description", label: "Mô tả", type: "text-truncate" },
    ],

    defaultValues: {
        name: "",
        slug: "",
        category: "",
        tags: [],
        price: 0,
        description: "",
        image: "",
    },
};
