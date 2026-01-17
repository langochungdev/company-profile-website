import type { ListingConfig } from "@/types/collection.type";

export const demoListingConfig: ListingConfig = {
    type: "collection",
    collection: "demo-items",
    collectionName: "Demo Items",

    path: "collections/demo-items/items",

    icon: "mdi:folder-multiple",
    order: 98,
    group: "Dev Tools",

    meta: {
        title: "Demo Items",
        description: "Danh sách demo items để test collection",
        keywords: ["demo", "test", "collection"],
    },

    listConfig: {
        itemsPerPage: 9,
        defaultSort: { field: "priority", direction: "desc" },

        sortOptions: [
            { field: "title", label: "Tên", direction: "asc" },
            { field: "priority", label: "Ưu tiên", direction: "desc" },
            { field: "publishedAt", label: "Mới nhất", direction: "desc" },
        ],

        filterBy: [
            {
                field: "category",
                label: "Danh mục",
                type: "select",
                options: ["tech", "design", "marketing", "development"],
            },
            {
                field: "status",
                label: "Trạng thái",
                type: "select",
                options: ["draft", "published", "archived"],
            },
            {
                field: "featured",
                label: "Nổi bật",
                type: "boolean",
            },
        ],

        searchFields: ["title", "description"],
        previewFields: ["thumbnail", "title", "description", "category", "status", "author", "publishedAt"],
    },
};
