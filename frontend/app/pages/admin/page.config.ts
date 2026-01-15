// Admin Page Config Registry - Central configuration import

import { homeConfig } from "@/pages/home/home.config";
import { servicePageConfig } from "@/pages/service/service.config";
import { productPageConfig } from "@/pages/product/product.config";
import { postPageConfig } from "@/pages/post/post.config";
import { openGraphConfig } from "./config/openGraph.config";

export interface FieldConfig {
    type: "text" | "textarea" | "number" | "boolean" | "select" | "image" | "video" | "array" | "group" | "richtext" | "date" | "color";
    label: string;
    note?: string;
    max?: number;
    min?: number;
    rows?: number;
    required?: boolean;
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

export const PAGE_CONFIGS: Record<string, PageConfig> = {
    home: homeConfig as PageConfig,
    service: servicePageConfig as unknown as PageConfig,
    product: productPageConfig as unknown as PageConfig,
    post: postPageConfig as unknown as PageConfig,
    "open-graph": openGraphConfig as PageConfig,
};

export type PageKey = keyof typeof PAGE_CONFIGS;

export const getPageConfig = (pageKey: string): PageConfig | undefined => {
    return PAGE_CONFIGS[pageKey];
};

export const getAllPages = (): Array<{ key: string } & PageConfig> => {
    return Object.entries(PAGE_CONFIGS)
        .map(([key, config]) => ({
            key,
            ...config,
        }))
        .sort((a, b) => a.order - b.order);
};

export interface SidebarGroup {
    name: string;
    items: SidebarItem[];
}

export interface SidebarItem {
    key: string;
    label: string;
    icon: string;
    order: number;
    path: string;
}

export const getSidebarItems = (): SidebarGroup[] => {
    const items = Object.entries(PAGE_CONFIGS)
        .map(([key, config]) => ({
            key,
            label: config.pageName,
            icon: config.icon,
            order: config.order,
            group: config.group || "Trang",
            path: `/admin/${key}`,
        }))
        .sort((a, b) => a.order - b.order);

    const groups: SidebarGroup[] = [];

    items.forEach((item) => {
        const existingGroup = groups.find((g) => g.name === item.group);
        if (existingGroup) {
            existingGroup.items.push({
                key: item.key,
                label: item.label,
                icon: item.icon,
                order: item.order,
                path: item.path,
            });
        } else {
            groups.push({
                name: item.group,
                items: [
                    {
                        key: item.key,
                        label: item.label,
                        icon: item.icon,
                        order: item.order,
                        path: item.path,
                    },
                ],
            });
        }
    });

    return groups;
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
