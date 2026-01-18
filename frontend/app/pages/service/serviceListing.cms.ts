// Cấu hình trang danh sách dịch vụ cho admin panel

import type { FieldConfig } from "~/pages/admin/config/page.config";

export interface ServiceListingConfig {
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

export const SERVICE_CATEGORIES = ["Camera", "Hạ Tầng Mạng", "WiFi", "Kiểm Soát", "An Toàn", "Viễn Thông"];

export const serviceListingConfig: ServiceListingConfig = {
    type: "listing",
    collection: "services",
    collectionName: "Dịch vụ",
    path: "collections/services/items",
    icon: "mdi:briefcase",
    order: 2,
    group: "Trang",

    listConfig: {
        itemsPerPage: 9,
        defaultSort: { field: "createdAt", direction: "desc" },
        sortOptions: [
            { field: "title", label: "Tên A-Z", direction: "asc" },
            { field: "createdAt", label: "Mới nhất", direction: "desc" },
        ],
        filterBy: [{ field: "category", label: "Danh mục", type: "select", options: SERVICE_CATEGORIES }],
        searchFields: ["title", "description"],
        previewFields: ["thumbnail", "title", "category", "price"],
    },

    sections: {
        settings: {
            label: "Cài đặt trang",
            collapsed: false,
            fields: {
                pageTitle: { type: "text", label: "Tiêu đề trang", max: 60, default: "Dịch Vụ" },
                pageDescription: { type: "textarea", label: "Mô tả trang", max: 200, rows: 3 },
                servicesPerPage: { type: "number", label: "Số dịch vụ/trang", min: 6, max: 24, default: 9 },
            },
        },
        cta: {
            label: "Call to Action",
            collapsed: true,
            fields: {
                enabled: { type: "boolean", label: "Hiển thị CTA?", default: true },
                title: { type: "text", label: "Tiêu đề", max: 60, default: "Cần Tư Vấn?" },
                description: { type: "textarea", label: "Mô tả", max: 150 },
                buttonText: { type: "text", label: "Text nút", max: 30, default: "Liên Hệ Ngay" },
                buttonLink: { type: "text", label: "Link nút", note: "VD: /lien-he" },
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

export const SERVICES: any[] = [];
