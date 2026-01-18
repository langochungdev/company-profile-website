// CMS Config Types - Auto-Discovery Architecture

import type { FieldConfig } from "@/admin/config/page.config";

export interface BaseCmsConfig {
    type: "page" | "detail";
    name: string;
    path: string;
    icon?: string;
    order?: number;
    group?: string;
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

export interface DetailCmsConfig extends BaseCmsConfig {
    type: "detail";
    collection: string;
    collectionName: string;
    itemFields: Record<string, FieldConfig>;
    tableColumns?: Array<{ key: string; label: string; type: "text" | "image" | "badge" | "currency" | "date"; width?: number }>;
    defaultValues?: Record<string, unknown>;
    detailTemplate?: {
        layout: { sections: string[]; relatedCount?: number; showBreadcrumb?: boolean };
        seo: { titleTemplate: string; descriptionField: string; imageField: string; authorField?: string };
    };
}

export type CmsConfig = PageCmsConfig | DetailCmsConfig;

export interface ParsedCmsConfig {
    key: string;
    filePath: string;
    config: CmsConfig;
    configType: "page" | "detail";
}

export interface PreviewItem {
    id: string;
    [key: string]: unknown;
}
