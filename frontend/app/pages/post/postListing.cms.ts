// Cấu hình trang danh sách bài viết cho admin panel

import type { FieldConfig } from "~/pages/admin/config/page.config";

export interface PostListingConfig {
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

export const POST_CATEGORIES = ["Công Nghệ", "Hạ Tầng Mạng", "An Ninh", "Giải Pháp", "Viễn Thông"];

export const postListingConfig: PostListingConfig = {
    type: "listing",
    collection: "posts",
    collectionName: "Bài viết",
    path: "collections/posts/items",
    icon: "mdi:post-outline",
    order: 4,
    group: "Trang",

    listConfig: {
        itemsPerPage: 9,
        defaultSort: { field: "publishedAt", direction: "desc" },
        sortOptions: [
            { field: "title", label: "Tiêu đề A-Z", direction: "asc" },
            { field: "publishedAt", label: "Mới nhất", direction: "desc" },
            { field: "publishedAt", label: "Cũ nhất", direction: "asc" },
        ],
        filterBy: [
            { field: "category", label: "Danh mục", type: "select", options: POST_CATEGORIES },
            { field: "status", label: "Trạng thái", type: "select", options: ["draft", "published"] },
        ],
        searchFields: ["title", "description"],
        previewFields: ["thumbnail", "title", "category", "author", "publishedAt"],
    },

    sections: {
        settings: {
            label: "Cài đặt trang",
            collapsed: false,
            fields: {
                pageTitle: { type: "text", label: "Tiêu đề trang", max: 60, default: "Tin Tức" },
                pageDescription: { type: "textarea", label: "Mô tả trang", max: 200, rows: 3 },
                postsPerPage: { type: "number", label: "Số bài/trang", min: 6, max: 24, default: 9 },
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

export const POSTS: any[] = [];
