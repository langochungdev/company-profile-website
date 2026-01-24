export const productConfig = {
    type: "detail" as const,
    collection: "products",
    path: "collections/products/items",
    icon: "mdi:package-variant",
    label: "Sản phẩm",

    seo: {
        listingTitle: "Sản Phẩm & Giải Pháp",
        listingDesc: "Danh mục sản phẩm an ninh, camera AI, thiết bị mạng WiFi doanh nghiệp, switch PoE, báo cháy và access control chính hãng.",
        titleField: "name",
        descField: "description",
        imageField: "images[0].url",
    },
    itemFields: {
        name: { type: "text", label: "Tên sản phẩm", isPreview: true },
        slug: { type: "text", label: "Slug", isPreview: true },
        category: { type: "text", label: "Danh mục", isPreview: true },
        price: { type: "number", label: "Giá", isPreview: true },
        images: { type: "array", label: "Hình ảnh", previewCount: 0 },
        tags: { type: "dynamic-multi-select", label: "Tags", isPreview: true },
        description: { type: "textarea", label: "Mô tả", isPreview: true, previewMaxLength: 150 },
    },
};

export type ProductConfig = typeof productConfig;
