// Schema Settings Fields - Generate editable fields cho từng schema type

import type { SchemaPageType } from "@/admin/types/schema";
import type { SettingsFieldConfig } from "./settings.config";

export interface SchemaFieldsConfig {
    config: Record<string, SettingsFieldConfig>;
    fieldMapping: Record<string, SettingsFieldConfig>;
}

const COMMON_SCHEMA_CONFIG: Record<string, SettingsFieldConfig> = {
    siteName: {
        type: "text",
        label: "Tên Website",
        note: "Tên website/thương hiệu hiển thị trong schema",
        max: 100,
        required: true,
    },
    siteUrl: {
        type: "text",
        label: "URL Website",
        note: "URL chính của website",
        max: 200,
    },
};

const HOME_SCHEMA_FIELDS: SchemaFieldsConfig = {
    config: {
        includeWebSite: {
            type: "select",
            label: "Bao gồm WebSite Schema",
            options: [
                { value: "true", label: "Có" },
                { value: "false", label: "Không" },
            ],
            default: "true",
        },
        includeOrganization: {
            type: "select",
            label: "Bao gồm Organization Schema",
            options: [
                { value: "true", label: "Có" },
                { value: "false", label: "Không" },
            ],
            default: "true",
        },
        includeSearchAction: {
            type: "select",
            label: "Bao gồm Search Action",
            options: [
                { value: "true", label: "Có" },
                { value: "false", label: "Không" },
            ],
            default: "true",
        },
        ...COMMON_SCHEMA_CONFIG,
        language: {
            type: "text",
            label: "Ngôn ngữ",
            default: "vi-VN",
            max: 10,
        },
    },
    fieldMapping: {},
};

const PRODUCT_LISTING_SCHEMA_FIELDS: SchemaFieldsConfig = {
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

const POST_LISTING_SCHEMA_FIELDS: SchemaFieldsConfig = {
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

const SERVICE_LISTING_SCHEMA_FIELDS: SchemaFieldsConfig = {
    config: {
        ...COMMON_SCHEMA_CONFIG,
        serviceType: {
            type: "select",
            label: "Loại dịch vụ",
            options: [
                { value: "Service", label: "Service" },
                { value: "ProfessionalService", label: "Professional Service" },
            ],
            default: "ProfessionalService",
        },
        providerName: {
            type: "text",
            label: "Tên nhà cung cấp",
            default: "SHT Security",
        },
        areaServed: {
            type: "text",
            label: "Khu vực phục vụ",
            default: "Việt Nam",
        },
    },
    fieldMapping: {
        name: {
            type: "text",
            label: "Field: Tên dịch vụ",
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
    },
};

const CONTACT_SCHEMA_FIELDS: SchemaFieldsConfig = {
    config: {
        ...COMMON_SCHEMA_CONFIG,
        telephone: {
            type: "text",
            label: "Số điện thoại",
            note: "Số điện thoại liên hệ chính",
        },
        email: {
            type: "text",
            label: "Email",
            note: "Email liên hệ chính",
        },
        address: {
            type: "textarea",
            label: "Địa chỉ",
            rows: 2,
        },
        openingHours: {
            type: "text",
            label: "Giờ mở cửa",
            note: "VD: Mo-Fr 08:00-17:00",
        },
    },
    fieldMapping: {},
};

const ABOUT_SCHEMA_FIELDS: SchemaFieldsConfig = {
    config: {
        ...COMMON_SCHEMA_CONFIG,
        foundingDate: {
            type: "text",
            label: "Ngày thành lập",
            note: "Format: YYYY-MM-DD",
        },
        numberOfEmployees: {
            type: "text",
            label: "Số nhân viên",
        },
        legalName: {
            type: "text",
            label: "Tên pháp lý",
            note: "Tên đầy đủ pháp lý của công ty",
        },
    },
    fieldMapping: {},
};

const FAQ_SCHEMA_FIELDS: SchemaFieldsConfig = {
    config: {
        ...COMMON_SCHEMA_CONFIG,
    },
    fieldMapping: {
        question: {
            type: "text",
            label: "Field: Câu hỏi",
            default: "question",
        },
        answer: {
            type: "text",
            label: "Field: Trả lời",
            default: "answer",
        },
    },
};

export const SCHEMA_FIELDS_MAP: Record<SchemaPageType, SchemaFieldsConfig> = {
    home: HOME_SCHEMA_FIELDS,
    about: ABOUT_SCHEMA_FIELDS,
    contact: CONTACT_SCHEMA_FIELDS,
    faq: FAQ_SCHEMA_FIELDS,
    project: PRODUCT_LISTING_SCHEMA_FIELDS,
    projectListing: PRODUCT_LISTING_SCHEMA_FIELDS,
    product: PRODUCT_LISTING_SCHEMA_FIELDS,
    productListing: PRODUCT_LISTING_SCHEMA_FIELDS,
    post: POST_LISTING_SCHEMA_FIELDS,
    postListing: POST_LISTING_SCHEMA_FIELDS,
    service: SERVICE_LISTING_SCHEMA_FIELDS,
    serviceListing: SERVICE_LISTING_SCHEMA_FIELDS,
};

export function getSchemaFields(schemaType: SchemaPageType): SchemaFieldsConfig {
    return SCHEMA_FIELDS_MAP[schemaType] || HOME_SCHEMA_FIELDS;
}

export function getSchemaConfigFields(schemaType: SchemaPageType): Record<string, SettingsFieldConfig> {
    return SCHEMA_FIELDS_MAP[schemaType]?.config || {};
}

export function getSchemaFieldMappingFields(schemaType: SchemaPageType): Record<string, SettingsFieldConfig> {
    return SCHEMA_FIELDS_MAP[schemaType]?.fieldMapping || {};
}
