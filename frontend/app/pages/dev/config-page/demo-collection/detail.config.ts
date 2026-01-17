import type { DetailConfig } from "@/types/collection.type";

export const demoDetailConfig: DetailConfig = {
    type: "collection",
    collection: "demo-items",
    collectionName: "Demo Item Detail",

    path: "collections/demo-items/items",

    icon: "mdi:file-document",
    order: 99,
    group: "Dev Tools",

    detailTemplate: {
        layout: {
            sections: ["thumbnail", "meta", "title", "description", "author", "tags", "related"],
            relatedCount: 3,
            showBreadcrumb: true,
        },
        seo: {
            titleTemplate: "{title} - Demo Collection",
            descriptionField: "description",
            imageField: "thumbnail",
            authorField: "author.name",
        },
    },

    itemFields: {
        title: {
            type: "text",
            label: "Title",
            max: 100,
            required: true,
        },
        slug: {
            type: "text",
            label: "Slug",
            max: 100,
            note: "URL-friendly version of title",
        },
        description: {
            type: "textarea",
            label: "Description",
            max: 500,
            rows: 4,
        },
        thumbnail: {
            type: "image",
            label: "Thumbnail Image",
            note: "600x400 recommended",
        },
        category: {
            type: "select",
            label: "Category",
            options: ["tech", "design", "marketing", "development"],
            default: "tech",
        },
        tags: {
            type: "array",
            label: "Tags",
            schema: {
                tag: {
                    type: "text",
                    label: "Tag Name",
                    max: 30,
                },
            },
        },
        featured: {
            type: "boolean",
            label: "Featured Item",
            default: false,
        },
        priority: {
            type: "number",
            label: "Display Priority",
            min: 0,
            max: 100,
            default: 50,
            note: "Higher = show first",
        },
        publishedAt: {
            type: "date",
            label: "Published Date",
        },
        author: {
            type: "object",
            label: "Author Info",
            schema: {
                name: {
                    type: "text",
                    label: "Author Name",
                    max: 50,
                },
                avatar: {
                    type: "image",
                    label: "Author Avatar",
                },
                bio: {
                    type: "textarea",
                    label: "Short Bio",
                    max: 200,
                    rows: 2,
                },
            },
        },
        status: {
            type: "select",
            label: "Status",
            options: ["draft", "published", "archived"],
            default: "draft",
        },
    },
};
