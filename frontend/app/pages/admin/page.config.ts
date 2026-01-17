// Admin Page Config Registry - Central configuration import

import { homeConfig } from "@/pages/home/home.config";
import { servicePageConfig } from "@/pages/service/service.config";
import { productPageConfig } from "@/pages/product/product.config";
import { postPageConfig } from "@/pages/post/post.config";
import { seoOpenGraphConfig } from "./config/seoOpenGraph.config";

export const SIDEBAR_PAGES: Array<{ key: string; config: PageConfig; group?: string }> = [
    { key: "home", config: homeConfig as PageConfig },
    // { key: "service", config: servicePageConfig as unknown as PageConfig },
    { key: "product", config: productPageConfig as unknown as PageConfig },
    // { key: "post", config: postPageConfig as unknown as PageConfig },
    // { key: "seo-open-graph", config: seoOpenGraphConfig as PageConfig, group: "Cài đặt" },
];

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
}

export interface SectionConfig {
    label: string;
    collapsed?: boolean;
    fields: Record<string, FieldConfig>;
}

export interface TableColumn {
    key: string;
    label: string;
    type: "text" | "image" | "badge" | "currency" | "date";
    width?: number;
}

export interface ItemConfig {
    name: string;
    namePlural: string;
    icon: string;
    config: {
        sections: Record<string, SectionConfig>;
        tableColumns: TableColumn[];
        defaultValues: Record<string, unknown>;
    };
    data: Record<string, unknown>[];
}

export interface PageConfig {
    page: string;
    pageName: string;
    path: string;
    icon: string;
    order: number;
    group?: string;
    type?: "page" | "collection";
    itemConfig?: ItemConfig;
    sections: Record<string, SectionConfig>;
}

export interface SidebarGroupConfig {
    name: string;
    visible?: boolean;
}

export const SIDEBAR_GROUPS: SidebarGroupConfig[] = [
    { name: "Trang", visible: true },
    { name: "Cài đặt", visible: true },
];

export const PAGE_CONFIGS: Record<string, PageConfig> = Object.fromEntries(SIDEBAR_PAGES.map(({ key, config }) => [key, config]));

export type PageKey = keyof typeof PAGE_CONFIGS;

export const getPageConfig = (pageKey: string): PageConfig | undefined => {
    return PAGE_CONFIGS[pageKey];
};

export const getAllPages = (): Array<{ key: string } & PageConfig> => {
    return SIDEBAR_PAGES.map(({ key, config }) => ({ key, ...config }));
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
}

export const getSidebarItems = (): SidebarGroup[] => {
    const visibleGroups = SIDEBAR_GROUPS.filter((g) => g.visible !== false);
    const groupMap = new Map<string, SidebarGroup>();

    visibleGroups.forEach((g) => {
        groupMap.set(g.name, { name: g.name, items: [] });
    });

    SIDEBAR_PAGES.forEach(({ key, config, group }) => {
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
        });
    });

    return visibleGroups.map((g) => groupMap.get(g.name)!).filter((g) => g && g.items.length > 0);
};

export const isCollectionPage = (pageKey: string): boolean => {
    const config = PAGE_CONFIGS[pageKey];
    return config?.type === "collection" && !!config.itemConfig;
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
