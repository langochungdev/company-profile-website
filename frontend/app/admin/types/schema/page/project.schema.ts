// Schema types cho Project/Portfolio Pages

import type { BaseSchema, OrganizationSchema, BreadcrumbSchema, ImageSchema, PersonSchema } from "../base.schema";

export interface ProjectDetailSchema extends BaseSchema {
    "@type": "CreativeWork" | "WebSite" | "SoftwareApplication";
    "@id"?: string;
    name: string;
    description?: string;
    url?: string;
    image?: string | string[] | ImageSchema[];
    dateCreated?: string;
    datePublished?: string;
    dateModified?: string;
    creator?: OrganizationSchema | PersonSchema;
    author?: OrganizationSchema | PersonSchema;
    provider?: OrganizationSchema;
    about?: string;
    keywords?: string[];
    thumbnailUrl?: string;
    video?: VideoSchema;
}

export interface VideoSchema {
    "@type": "VideoObject";
    name: string;
    description?: string;
    thumbnailUrl?: string;
    uploadDate?: string;
    duration?: string;
    contentUrl?: string;
    embedUrl?: string;
}

export interface CaseStudySchema extends ProjectDetailSchema {
    "@type": "CreativeWork";
    learningResourceType?: "case study";
    audience?: { "@type": "Audience"; audienceType: string };
    educationalLevel?: string;
    teaches?: string[];
}

export interface ProjectListingSchema extends BaseSchema {
    "@type": "ItemList";
    name: string;
    description?: string;
    numberOfItems: number;
    itemListElement: ProjectListItemSchema[];
}

export interface ProjectListItemSchema {
    "@type": "ListItem";
    position: number;
    url?: string;
    item: ProjectDetailSchema;
}

export interface ProjectCollectionSchema extends BaseSchema {
    "@type": "CollectionPage";
    name: string;
    description?: string;
    url?: string;
    breadcrumb?: BreadcrumbSchema;
    mainEntity: ProjectListingSchema;
}

export interface ImageGallerySchema extends BaseSchema {
    "@type": "ImageGallery";
    name: string;
    description?: string;
    image: ImageSchema[];
    creator?: OrganizationSchema;
}

export interface ProjectSchemaConfig {
    type?: "CreativeWork" | "WebSite" | "SoftwareApplication";
    includeCreator?: boolean;
    includeVideo?: boolean;
    includeGallery?: boolean;
}

export const DEFAULT_PROJECT_SCHEMA_CONFIG: ProjectSchemaConfig = {
    type: "CreativeWork",
    includeCreator: true,
    includeVideo: false,
    includeGallery: true,
};

export interface ProjectSchemaFieldMapping {
    name: string;
    description?: string;
    image?: string;
    dateCreated?: string;
    category?: string;
    client?: string;
}

export const DEFAULT_PROJECT_FIELD_MAPPING: ProjectSchemaFieldMapping = {
    name: "title",
    description: "description",
    image: "thumbnail",
    dateCreated: "year",
    category: "category",
};
