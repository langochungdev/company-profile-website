// Cấu hình trang danh sách sản phẩm cho admin panel

import type { FieldConfig } from "~/pages/admin/config/page.config";

export interface ProductListingConfig {
    type: "listing";
    collection: string;
    collectionName: string;
    path: string;
    icon: string;
    order: number;
    group: string;

    listConfig: {
        itemsPerPage: number;
        defaultSort: { field: string; direction: "asc" | "desc" };
        sortOptions: Array<{ field: string; label: string; direction: "asc" | "desc" }>;
        filterBy: Array<{ field: string; label: string; type: "select" | "range" | "boolean"; options?: string[] }>;
        searchFields: string[];
        previewFields: string[];
    };

    sections: Record<string, { label: string; collapsed?: boolean; fields: Record<string, FieldConfig> }>;
}

export const PRODUCT_CATEGORIES = ["Camera AI", "WiFi Doanh Nghiệp", "Switch & Router", "Báo Cháy", "Access Control"];

export const productListingConfig: ProductListingConfig = {
    type: "listing",
    collection: "products",
    collectionName: "Sản phẩm",
    path: "collections/products/items",
    icon: "mdi:package-variant",
    order: 3,
    group: "Trang",

    listConfig: {
        itemsPerPage: 12,
        defaultSort: { field: "createdAt", direction: "desc" },
        sortOptions: [
            { field: "name", label: "Tên A-Z", direction: "asc" },
            { field: "price", label: "Giá tăng dần", direction: "asc" },
            { field: "price", label: "Giá giảm dần", direction: "desc" },
            { field: "createdAt", label: "Mới nhất", direction: "desc" },
        ],
        filterBy: [
            { field: "category", label: "Danh mục", type: "select", options: PRODUCT_CATEGORIES },
            { field: "badge", label: "Badge", type: "select", options: ["Best Seller", "New", "Hot", "Sale"] },
        ],
        searchFields: ["name", "description"],
        previewFields: ["image", "name", "category", "price", "badge"],
    },

    sections: {
        settings: {
            label: "Cài đặt trang",
            collapsed: false,
            fields: {
                pageTitle: { type: "text", label: "Tiêu đề trang", max: 60, default: "Sản Phẩm" },
                pageDescription: { type: "textarea", label: "Mô tả trang", max: 200, rows: 3 },
                productsPerPage: { type: "number", label: "Số sản phẩm/trang", min: 6, max: 24, default: 12 },
            },
        },
        seo: {
            label: "SEO & Meta Tags",
            collapsed: true,
            fields: {
                title: { type: "text", label: "Meta Title", max: 60 },
                description: { type: "textarea", label: "Meta Description", max: 160, rows: 3 },
                ogImage: { type: "image", label: "OG Image", note: "1200x630px" },
            },
        },
    },
};

export const PRODUCTS: any[] = [];
