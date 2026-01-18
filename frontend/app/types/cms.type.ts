// CMS Config Types - Auto-Discovery Architecture
import type { FieldConfig } from "~/pages/admin/config/page.config";

export interface BaseCmsConfig {
    type: "page" | "listing" | "detail";
    name: string;
    path: string;
    icon?: string;
    order?: number;
    group?: string;
}

export interface ListingSettings {
    layout: {
        gridColumns: 2 | 3 | 4 | 5;
        itemsPerPage: 6 | 9 | 12 | 16 | 24;
        cardStyle: "grid" | "list" | "compact";
        showSidebar: boolean;
    };
    display: {
        showPrice: boolean;
        showBadge: boolean;
        showRating: boolean;
        showQuickView: boolean;
        showAddToCart: boolean;
    };
    hero: {
        enabled: boolean;
        title: string;
        subtitle: string;
        image: string;
    };
    seo: {
        pageTitle: string;
        metaDescription: string;
        ogImage: string;
    };
}

export interface SectionConfig {
    title?: string;
    fields: Record<string, FieldConfig>;
}

export interface PageCmsConfig extends BaseCmsConfig {
    type: "page";
    pageName: string;
    sections: Record<string, SectionConfig>;
}

export interface ListingCmsConfig extends BaseCmsConfig {
    type: "listing";
    collection: string;
    collectionName: string;
    listingSettings?: ListingSettings;
    listConfig?: {
        itemsPerPage: number;
        defaultSort: { field: string; direction: "asc" | "desc" };
        sortOptions?: Array<{ field: string; label: string; direction: "asc" | "desc" }>;
        filterBy?: Array<{ field: string; label: string; type: string; options?: any[] }>;
        searchFields?: string[];
    };
}

export interface DetailCmsConfig extends BaseCmsConfig {
    type: "detail";
    collection: string;
    collectionName: string;
    itemFields: Record<string, FieldConfig>;
    detailTemplate?: {
        layout: { sections: string[]; relatedCount?: number; showBreadcrumb?: boolean };
        seo: { titleTemplate: string; descriptionField: string; imageField: string };
    };
}

export type CmsConfig = PageCmsConfig | ListingCmsConfig | DetailCmsConfig;

export interface ParsedCmsConfig {
    key: string;
    filePath: string;
    config: CmsConfig;
    configType: "page" | "listing" | "detail";
}

export interface ListingConfig {
    type: "listing";
    collection: string;
    collectionName: string;
    path: string;
    icon?: string;
    order?: number;
    group?: string;

    meta?: {
        title: string;
        description: string;
        keywords?: string[];
    };

    listConfig: {
        itemsPerPage: number;
        defaultSort: { field: string; direction: "asc" | "desc" };
        sortOptions: Array<{ field: string; label: string; direction: "asc" | "desc" }>;
        filterBy: Array<{ field: string; label: string; type: "select" | "range" | "boolean"; options?: any[] }>;
        searchFields?: string[];
        previewFields?: string[];
    };
}

export interface DetailConfig {
    type: "detail";
    collection: string;
    collectionName: string;
    path: string;
    icon?: string;
    order?: number;
    group?: string;

    detailTemplate?: {
        layout: { sections: string[]; relatedCount?: number; showBreadcrumb?: boolean };
        seo: { titleTemplate: string; descriptionField: string; imageField: string; authorField?: string };
    };

    itemFields: Record<string, FieldConfig>;
}
