import type { FieldConfig, SectionConfig, TableColumn } from "../page.config";

export const serviceDetailConfig = {
    type: "detail",
    collection: "services",
    collectionName: "Dự án",
    path: "collections/services/items",
    icon: "mdi:briefcase-check",
    order: 3,
    group: "Nội dung",

    listingSchemaType: "services",

    tableColumns: [
        { key: "name", label: "Tên dự án", type: "text-truncate", width: 250 },
        { key: "categories", label: "Danh mục", type: "badge-list", width: 200 },
        { key: "tags", label: "Tags", type: "badge-list", width: 180 },
        { key: "location", label: "Địa điểm", type: "text", width: 150 },
        { key: "completedDate", label: "Ngày hoàn thành", type: "date", width: 130 },
        { key: "images", label: "Ảnh", type: "image", width: 100 },
    ] as TableColumn[],

    listConfig: {
        searchFields: ["name", "location", "description"],
        filterBy: [
            { field: "categories", label: "Danh mục", options: [] },
            { field: "tags", label: "Tags", options: [] },
        ],
        sortOptions: [
            { field: "completedDate", label: "Ngày hoàn thành", direction: "desc" as const },
            { field: "name", label: "Tên dự án", direction: "asc" as const },
        ],
    },

    itemFields: {
        name: {
            type: "text",
            label: "Tên dự án",
            required: true,
            placeholder: "VD: Lắp đặt hệ thống Camera AI cho Văn phòng XYZ",
            isPreview: true,
        } as FieldConfig,

        categories: {
            type: "dynamic-multi-select",
            label: "Danh mục",
            required: true,
            configKey: "categories",
            collectionPath: "collections/services/items",
            isPreview: true,
        } as FieldConfig,

        tags: {
            type: "dynamic-multi-select",
            label: "Tags",
            configKey: "tags",
            collectionPath: "collections/products/items",
            note: "Gắn tag từ danh sách sản phẩm",
            isPreview: true,
        } as FieldConfig,

        description: {
            type: "textarea",
            label: "Mô tả dự án",
            rows: 4,
            placeholder: "Mô tả chi tiết về dự án...",
            isPreview: true,
            previewMaxLength: 150,
        } as FieldConfig,

        completedDate: {
            type: "date",
            label: "Ngày hoàn thành",
            required: true,
            isPreview: true,
        } as FieldConfig,

        location: {
            type: "text",
            label: "Địa điểm",
            required: true,
            placeholder: "VD: Hà Nội, Việt Nam",
            isPreview: true,
        } as FieldConfig,

        images: {
            type: "array",
            label: "Hình ảnh dự án",
            note: "Upload ảnh dự án (tối thiểu 4 ảnh). Ảnh đầu tiên sẽ là ảnh đại diện.",
            min: 4,
            schema: {
                url: { type: "image", label: "Ảnh", required: true } as FieldConfig,
                alt: { type: "text", label: "Mô tả ảnh", placeholder: "Mô tả ngắn cho SEO" } as FieldConfig,
            },
            isPreview: true,
            previewCount: 4,
        } as FieldConfig,
    },

    defaultValues: {
        name: "",
        categories: [],
        tags: [],
        description: "",
        completedDate: new Date().toISOString().split("T")[0],
        location: "",
        images: [],
    },

    sections: {
        basic: {
            label: "Thông tin cơ bản",
            fields: {
                name: { type: "text", label: "Tên dự án" } as FieldConfig,
                category: { type: "dynamic-select", label: "Danh mục" } as FieldConfig,
                description: { type: "textarea", label: "Mô tả" } as FieldConfig,
            },
        } as SectionConfig,
        details: {
            label: "Chi tiết dự án",
            fields: {
                completedDate: { type: "date", label: "Ngày hoàn thành" } as FieldConfig,
                location: { type: "text", label: "Địa điểm" } as FieldConfig,
            },
        } as SectionConfig,
        images: {
            label: "Hình ảnh",
            fields: {
                images: { type: "array", label: "Hình ảnh dự án" } as FieldConfig,
            },
        } as SectionConfig,
    },
};
