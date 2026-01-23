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
};

export type ProductConfig = typeof productConfig;
