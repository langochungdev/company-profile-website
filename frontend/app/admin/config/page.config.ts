// Admin Page Config Registry - Auto-Discovery Architecture

import type { CmsConfig, ParsedCmsConfig } from "@/admin/types/cms.type";
import { SIDEBAR_ORDER } from "@/admin/sidebar.config";

const cmsModules = import.meta.glob("/pages/**/*.cms.ts", { eager: true });

function parseConfigType(config: any): "page" | "detail" {
    if (config.type === "detail") return "detail";
    if (config.type === "page") return "page";
    if (config.itemFields) return "detail";
    if (config.sections) return "page";
    return "page";
}

function parseCmsConfigs(modules: Record<string, unknown>): ParsedCmsConfig[] {
    return Object.entries(modules)
        .map(([filePath, module]) => {
            const fileName = filePath.split("/").pop()?.replace(".cms.ts", "") || "";
            const mod = module as Record<string, any>;
            const exportedValues = Object.values(mod).filter((v) => v && typeof v === "object" && !Array.isArray(v));
            const config = exportedValues.find((v: any) => v.path || v.collection || v.sections || v.itemFields);
            if (!config) return null;

            return {
                key: fileName,
                filePath,
                config: config as CmsConfig,
                configType: parseConfigType(config),
            };
        })
        .filter((c): c is ParsedCmsConfig => c !== null)
        .sort((a, b) => (a.config.order || 100) - (b.config.order || 100));
}

export const ALL_CMS_CONFIGS = parseCmsConfigs(cmsModules);
export const PAGE_CMS_CONFIGS = ALL_CMS_CONFIGS.filter((c) => c.configType === "page");
export const DETAIL_CMS_CONFIGS = ALL_CMS_CONFIGS.filter((c) => c.configType === "detail");

export function getCollectionPair(collectionName: string) {
    const detail = DETAIL_CMS_CONFIGS.find((c) => (c.config as any).collection === collectionName);
    return { detail: detail?.config };
}

export function getDetailConfigByKey(detailKey: string) {
    const detailConfig = DETAIL_CMS_CONFIGS.find((c) => c.key === detailKey);
    return detailConfig?.config || null;
}

export interface CollectionPageConfig {
    key: string;
    detail: any;
    pageName: string;
    icon: string;
    order: number;
    group: string;
    path: string;
}

export const COLLECTION_PAGES: CollectionPageConfig[] = DETAIL_CMS_CONFIGS.map((dc) => {
    const detail = dc.config as any;
    return {
        key: dc.key.replace("Detail", ""),
        detail,
        pageName: detail.collectionName || detail.pageName || dc.key,
        icon: detail.icon || "mdi:folder",
        order: detail.order || 100,
        group: detail.group || "Trang",
        path: detail.path || "",
    };
});

const ALL_SIDEBAR_PAGES: Array<{ key: string; config: PageConfig; group?: string; configType: "page" | "detail" }> = [
    ...PAGE_CMS_CONFIGS.map((c) => ({
        key: c.key,
        config: c.config as unknown as PageConfig,
        group: c.config.group,
        configType: "page" as const,
    })),
    ...COLLECTION_PAGES.map((cp) => ({
        key: cp.key,
        config: {
            page: cp.key,
            pageName: cp.pageName,
            path: cp.path,
            icon: cp.icon,
            order: cp.order,
            group: cp.group,
            type: "detail" as const,
            schemaType: cp.detail.listingSchemaType || cp.detail.schemaType,
            sections: cp.detail.sections || {},
            listConfig: cp.detail.listConfig,
            detailConfig: cp.detail,
        } as unknown as PageConfig,
        group: cp.group,
        configType: "detail" as const,
    })),
];

export const SIDEBAR_PAGES = SIDEBAR_ORDER.map((key) => ALL_SIDEBAR_PAGES.find((p) => p.key === key)).filter((p): p is NonNullable<typeof p> => p !== undefined);

export interface FieldConfig {
    type: "text" | "textarea" | "number" | "boolean" | "select" | "image" | "video" | "array" | "group" | "richtext" | "date" | "color" | "object";
    label: string;
    note?: string;
    max?: number;
    min?: number;
    exact?: number;
    rows?: number;
    required?: boolean;
    unique?: boolean;
    default?: string | number | boolean;
    options?: string[] | { value: string; label: string }[];
    placeholder?: string;
    showIf?: { field: string; value: string | boolean | string[] };
    schema?: Record<string, FieldConfig>;
    fields?: Record<string, FieldConfig>;
    sortable?: boolean;
    toolbar?: string[];
    isPreview?: boolean;
    previewCount?: number;
    previewMaxLength?: number;
}

export interface SectionConfig {
    label: string;
    component?: string;
    collapsed?: boolean;
    visible?: boolean;
    fields: Record<string, FieldConfig>;
}

export interface TableColumn {
    key: string;
    label: string;
    type: "text" | "image" | "badge" | "currency" | "date";
    width?: number;
}

export interface PageConfig {
    page: string;
    pageName: string;
    path: string;
    icon: string;
    order: number;
    group?: string;
    type?: "page" | "detail";
    componentBase?: string;
    schemaType?: string;
    sections: Record<string, SectionConfig>;
    listConfig?: any;
    detailConfig?: any;
}

export interface SidebarGroupConfig {
    name: string;
    visible?: boolean;
}

export const SIDEBAR_GROUPS: SidebarGroupConfig[] = [
    { name: "Trang", visible: true },
    { name: "Cài đặt", visible: true },
    { name: "Dev Tools", visible: true },
];

export const PAGE_CONFIGS: Record<string, PageConfig> = Object.fromEntries(SIDEBAR_PAGES.map(({ key, config }) => [key, config]));

export type PageKey = keyof typeof PAGE_CONFIGS;

export const getPageConfig = (pageKey: string): PageConfig | undefined => {
    return PAGE_CONFIGS[pageKey];
};

export const getAllPages = (): Array<{ key: string; configType: "page" | "detail" } & PageConfig> => {
    return SIDEBAR_PAGES.map(({ key, config, configType }) => ({ key, configType, ...config }));
};

export interface SidebarGroup {
    name: string;
    items: SidebarItem[];
}

export interface SidebarItem {
    key: string;
    label: string;
    icon: string;
    path: string;
    type: "page" | "detail";
}

export const getSidebarItems = (): SidebarGroup[] => {
    const visibleGroups = SIDEBAR_GROUPS.filter((g) => g.visible !== false);
    const groupMap = new Map<string, SidebarGroup>();

    visibleGroups.forEach((g) => {
        groupMap.set(g.name, { name: g.name, items: [] });
    });

    SIDEBAR_PAGES.forEach(({ key, config, group, configType }) => {
        const groupName = group ?? config.group ?? "Trang";
        let sidebarGroup = groupMap.get(groupName);

        if (!sidebarGroup) {
            sidebarGroup = { name: groupName, items: [] };
            groupMap.set(groupName, sidebarGroup);
        }

        sidebarGroup.items.push({
            key,
            label: config.pageName,
            icon: config.icon,
            path: `/admin/${key}`,
            type: configType,
        });
    });

    return visibleGroups.map((g) => groupMap.get(g.name)!).filter((g) => g && g.items.length > 0);
};

export const isCollectionPage = (pageKey: string): boolean => {
    const config = PAGE_CONFIGS[pageKey];
    return config?.type === "detail";
};

export const getListingConfig = (pageKey: string) => {
    const config = PAGE_CONFIGS[pageKey];
    return config?.listConfig || null;
};

export const getDetailConfig = (pageKey: string) => {
    const config = PAGE_CONFIGS[pageKey];
    return config?.detailConfig || null;
};

export const getFirestorePath = (pageKey: string, sectionId?: string): string => {
    const config = PAGE_CONFIGS[pageKey];
    if (!config) return "";
    return sectionId ? `${config.path}/${sectionId}` : config.path;
};

export const FIELD_TYPE_MAP = {
    text: "TextInput",
    textarea: "TextareaInput",
    number: "NumberInput",
    boolean: "BooleanCheckbox",
    select: "SelectDropdown",
    image: "ImageUploader",
    video: "VideoUploader",
    richtext: "RichTextEditor",
    array: "ArrayEditor",
    group: "FieldGroup",
    date: "DatePicker",
    color: "ColorPicker",
} as const;

export type FieldType = keyof typeof FIELD_TYPE_MAP;
