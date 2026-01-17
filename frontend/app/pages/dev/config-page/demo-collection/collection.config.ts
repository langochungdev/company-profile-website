// Unified Collection Config - Gộp Listing + Detail settings
import type { FieldConfig } from "@/pages/admin/page.config";

export interface ListingLayoutConfig {
    gridColumns: 2 | 3 | 4 | 5;
    itemsPerPage: 6 | 9 | 12 | 16 | 24;
    cardStyle: "grid" | "list" | "compact";
    showSidebar: boolean;
}

export interface ListingDisplayConfig {
    showPrice: boolean;
    showBadge: boolean;
    showRating: boolean;
    showQuickView: boolean;
    showAddToCart: boolean;
}

export interface ListingHeroConfig {
    enabled: boolean;
    title: string;
    subtitle: string;
    image: string;
}

export interface ListingSeoConfig {
    pageTitle: string;
    metaDescription: string;
    ogImage: string;
}

export interface ListingSettings {
    layout: ListingLayoutConfig;
    display: ListingDisplayConfig;
    hero: ListingHeroConfig;
    seo: ListingSeoConfig;
}

export interface CollectionConfig {
    type: "collection";
    name: string;
    path: string;
    icon: string;
    order: number;
    group?: string;
    listingSettings: ListingSettings;
    itemFields: Record<string, FieldConfig>;
}

export const demoCollectionConfig: CollectionConfig = {
    type: "collection",
    name: "Demo Products",
    path: "collections/demo-items/items",
    icon: "mdi:package-variant",
    order: 99,
    group: "Dev Tools",

    listingSettings: {
        layout: {
            gridColumns: 3,
            itemsPerPage: 9,
            cardStyle: "grid",
            showSidebar: true,
        },
        display: {
            showPrice: true,
            showBadge: true,
            showRating: false,
            showQuickView: true,
            showAddToCart: false,
        },
        hero: {
            enabled: true,
            title: "Demo Products",
            subtitle: "Explore our demo product collection",
            image: "",
        },
        seo: {
            pageTitle: "Demo Products | My Store",
            metaDescription: "Browse our demo product collection",
            ogImage: "",
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
        status: {
            type: "select",
            label: "Status",
            options: ["draft", "published", "archived"],
            default: "draft",
        },
    },
};
