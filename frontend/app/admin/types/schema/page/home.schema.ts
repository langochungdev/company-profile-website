// Schema types cho Home Page

import type { BaseSchema, OrganizationSchema, BreadcrumbSchema, ImageSchema } from "../base.schema";

export interface HomePageSchema extends BaseSchema {
    "@type": "WebPage";
    "@id"?: string;
    name: string;
    description?: string;
    url: string;
    isPartOf?: WebSiteSchema;
    about?: OrganizationSchema;
    breadcrumb?: BreadcrumbSchema;
    primaryImageOfPage?: ImageSchema;
}

export interface WebSiteSchema extends BaseSchema {
    "@type": "WebSite";
    "@id"?: string;
    name: string;
    url: string;
    description?: string;
    publisher?: OrganizationSchema;
    potentialAction?: SearchActionSchema;
    inLanguage?: string;
}

export interface SearchActionSchema {
    "@type": "SearchAction";
    target: {
        "@type": "EntryPoint";
        urlTemplate: string;
    };
    "query-input": string;
}

export interface HomeSchemaConfig {
    includeWebSite?: boolean;
    includeOrganization?: boolean;
    includeSearchAction?: boolean;
    siteName?: string;
    siteUrl?: string;
    language?: string;
}

export const DEFAULT_HOME_SCHEMA_CONFIG: HomeSchemaConfig = {
    includeWebSite: true,
    includeOrganization: true,
    includeSearchAction: true,
    language: "vi-VN",
};

export interface HomeSchemaFieldMapping {
    name: string;
    description?: string;
    image?: string;
}

export const DEFAULT_HOME_FIELD_MAPPING: HomeSchemaFieldMapping = {
    name: "siteName",
    description: "siteDescription",
    image: "ogImage",
};
