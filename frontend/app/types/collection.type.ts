import type { FieldConfig } from "@/pages/admin/page.config";

export interface ListingConfig {
    type: "collection";
    collection: string;
    collectionName: string;
    path: string;
    itemsPath?: string;

    icon?: string;
    order?: number;
    group?: string;

    meta: {
        title: string;
        description: string;
        keywords?: string[];
    };

    listConfig: {
        itemsPerPage: number;
        defaultSort: { field: string; direction: "asc" | "desc" };
        sortOptions: Array<{
            field: string;
            label: string;
            direction: "asc" | "desc";
        }>;
        filterBy: Array<{
            field: string;
            label: string;
            type: "select" | "range" | "boolean";
            options?: any[];
        }>;
        searchFields?: string[];
        previewFields?: string[];
    };
}

export interface DetailConfig {
    type: "collection";
    collection: string;
    collectionName: string;
    path: string;
    itemsPath?: string;

    icon?: string;
    order?: number;
    group?: string;

    detailTemplate: {
        layout: {
            sections: string[];
            relatedCount?: number;
            showBreadcrumb?: boolean;
        };
        seo: {
            titleTemplate: string;
            descriptionField: string;
            imageField: string;
            authorField?: string;
        };
    };

    itemFields: Record<string, FieldConfig>;
}
