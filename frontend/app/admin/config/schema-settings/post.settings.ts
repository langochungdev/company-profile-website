/** Post/Article Schema Settings */

import { COMMON_SCHEMA_CONFIG, type SchemaFieldsConfig } from "@/admin/config/settings.config";

export const schemaKey = "post";

export const schemaSettings: SchemaFieldsConfig = {
    config: {
        ...COMMON_SCHEMA_CONFIG,
        articleType: {
            type: "select",
            label: "Loại bài viết",
            options: [
                { value: "Article", label: "Article" },
                { value: "BlogPosting", label: "Blog Posting" },
                { value: "NewsArticle", label: "News Article" },
            ],
            default: "Article",
        },
        includeAuthor: {
            type: "select",
            label: "Bao gồm tác giả",
            options: [
                { value: "true", label: "Có" },
                { value: "false", label: "Không" },
            ],
            default: "true",
        },
        includePublisher: {
            type: "select",
            label: "Bao gồm Publisher",
            options: [
                { value: "true", label: "Có" },
                { value: "false", label: "Không" },
            ],
            default: "true",
        },
        publisherName: {
            type: "text",
            label: "Tên Publisher",
            default: "SHT Security",
        },
    },
    fieldMapping: {
        title: {
            type: "text",
            label: "Field: Tiêu đề",
            default: "title",
        },
        description: {
            type: "text",
            label: "Field: Mô tả",
            default: "description",
        },
        image: {
            type: "text",
            label: "Field: Hình ảnh",
            default: "thumbnail",
        },
        author: {
            type: "text",
            label: "Field: Tác giả",
            default: "author",
        },
        datePublished: {
            type: "text",
            label: "Field: Ngày đăng",
            default: "publishedAt",
        },
    },
};

export const aliases = ["postListing"];
