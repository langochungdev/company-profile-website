/** Product Schema Settings */

import { COMMON_SCHEMA_CONFIG, type SchemaFieldsConfig } from "@/admin/config/settings.config";

export const schemaKey = "product";

export const schemaSettings: SchemaFieldsConfig = {
    config: {
        ...COMMON_SCHEMA_CONFIG,
        includeBrand: {
            type: "select",
            label: "Bao gồm Brand",
            options: [
                { value: "true", label: "Có" },
                { value: "false", label: "Không" },
            ],
            default: "true",
        },
        brandName: {
            type: "text",
            label: "Tên thương hiệu",
            note: "Tên brand mặc định cho sản phẩm",
            max: 100,
        },
        includeOffers: {
            type: "select",
            label: "Bao gồm giá (Offers)",
            options: [
                { value: "true", label: "Có" },
                { value: "false", label: "Không" },
            ],
            default: "true",
        },
        currency: {
            type: "select",
            label: "Đơn vị tiền tệ",
            options: [
                { value: "VND", label: "VND - Việt Nam Đồng" },
                { value: "USD", label: "USD - US Dollar" },
            ],
            default: "VND",
        },
        availability: {
            type: "select",
            label: "Tình trạng mặc định",
            options: [
                { value: "InStock", label: "Còn hàng" },
                { value: "OutOfStock", label: "Hết hàng" },
                { value: "PreOrder", label: "Đặt trước" },
            ],
            default: "InStock",
        },
        includeRating: {
            type: "select",
            label: "Bao gồm đánh giá (Rating)",
            options: [
                { value: "true", label: "Có" },
                { value: "false", label: "Không" },
            ],
            default: "false",
        },
    },
    fieldMapping: {
        name: {
            type: "text",
            label: "Field: Tên sản phẩm",
            note: "Field name trong data để lấy tên sản phẩm",
            default: "name",
        },
        description: {
            type: "text",
            label: "Field: Mô tả",
            default: "description",
        },
        image: {
            type: "text",
            label: "Field: Hình ảnh",
            default: "image",
        },
        price: {
            type: "text",
            label: "Field: Giá",
            default: "price",
        },
        category: {
            type: "text",
            label: "Field: Danh mục",
            default: "category",
        },
    },
};

export const aliases = ["productListing", "project", "projectListing"];
