// Schema types cho Post/Blog pages (Detail + Listing)

import type { BaseSchema, PersonSchema, OrganizationSchema, ImageSchema, BreadcrumbSchema } from "../base.schema";

export interface PostDetailSchema extends BaseSchema {
    "@type": "Article" | "BlogPosting" | "NewsArticle" | "TechArticle";
    "@id"?: string;
    headline: string;
    alternativeHeadline?: string;
    description?: string;
    image?: string | string[] | ImageSchema;
    datePublished?: string;
    dateModified?: string;
    dateCreated?: string;
    author?: PersonSchema | PersonSchema[] | OrganizationSchema;
    publisher?: OrganizationSchema;
    mainEntityOfPage?: { "@type": "WebPage"; "@id": string };
    articleSection?: string;
    articleBody?: string;
    wordCount?: number;
    keywords?: string | string[];
    inLanguage?: string;
    copyrightHolder?: OrganizationSchema | PersonSchema;
    copyrightYear?: number;
    isAccessibleForFree?: boolean;
    commentCount?: number;
    comment?: CommentSchema[];
}

export interface CommentSchema {
    "@type": "Comment";
    author: { "@type": "Person"; name: string };
    dateCreated?: string;
    text: string;
}

export interface BlogPostingSchema extends PostDetailSchema {
    "@type": "BlogPosting";
}

export interface NewsArticleSchema extends PostDetailSchema {
    "@type": "NewsArticle";
    dateline?: string;
    printColumn?: string;
    printEdition?: string;
    printPage?: string;
    printSection?: string;
}

export interface TechArticleSchema extends PostDetailSchema {
    "@type": "TechArticle";
    dependencies?: string;
    proficiencyLevel?: "Beginner" | "Expert";
}

export interface PostListingSchema extends BaseSchema {
    "@type": "ItemList";
    name: string;
    description?: string;
    numberOfItems: number;
    itemListElement: PostListItemSchema[];
    itemListOrder?: "Ascending" | "Descending" | "Unordered";
}

export interface PostListItemSchema {
    "@type": "ListItem";
    position: number;
    url?: string;
    item: PostDetailSchema;
}

export interface BlogSchema extends BaseSchema {
    "@type": "Blog";
    "@id"?: string;
    name: string;
    description?: string;
    url?: string;
    publisher?: OrganizationSchema;
    blogPost?: PostDetailSchema[];
    inLanguage?: string;
}

export interface PostCollectionSchema extends BaseSchema {
    "@type": "CollectionPage";
    "@id"?: string;
    name: string;
    description?: string;
    url?: string;
    breadcrumb?: BreadcrumbSchema;
    mainEntity: PostListingSchema | BlogSchema;
}

export interface PostSchemaConfig {
    type: "Article" | "BlogPosting" | "NewsArticle" | "TechArticle";
    includeAuthor?: boolean;
    includePublisher?: boolean;
    includeDateModified?: boolean;
    includeComments?: boolean;
    includeWordCount?: boolean;
}

export const DEFAULT_POST_SCHEMA_CONFIG: PostSchemaConfig = {
    type: "Article",
    includeAuthor: true,
    includePublisher: true,
    includeDateModified: true,
    includeComments: false,
    includeWordCount: false,
};

export interface PostSchemaFieldMapping {
    headline: string;
    description?: string;
    image?: string;
    datePublished?: string;
    dateModified?: string;
    author?: string;
    category?: string;
    content?: string;
}

export const DEFAULT_POST_FIELD_MAPPING: PostSchemaFieldMapping = {
    headline: "title",
    description: "description",
    image: "thumbnail",
    datePublished: "publishedAt",
    dateModified: "updatedAt",
    author: "author",
    category: "category",
    content: "content",
};
