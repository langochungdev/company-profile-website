// Export tất cả schema types và registry

export * from "./base.schema";
export type { WebSiteSchema, OrganizationSchema as HomeOrganizationSchema } from "./global.schema";
export type { CollectionPageSchema, BreadcrumbList } from "./page/product-list.schema";
export type { ProductSchema, Brand, Offer, AggregateRating, Review, ReviewRating, ReviewAuthor, BreadcrumbListSchema, AvailabilityType } from "./page/product-detail.schema";

export type SchemaPageType = "home" | "about" | "contact" | "faq" | "project" | "projectListing" | "product" | "productListing" | "post" | "postListing" | "service" | "serviceListing";

export interface SchemaRegistry {
    home: "WebPage";
    about: "AboutPage";
    contact: "ContactPage";
    faq: "FAQPage";
    project: "CreativeWork";
    projectListing: "ItemList";
    product: "Product";
    productListing: "ItemList";
    post: "Article" | "BlogPosting" | "NewsArticle";
    postListing: "ItemList";
    service: "Service" | "ProfessionalService";
    serviceListing: "ItemList";
}

export const SCHEMA_TYPE_MAP: Record<SchemaPageType, string> = {
    home: "WebPage",
    about: "AboutPage",
    contact: "ContactPage",
    faq: "FAQPage",
    project: "CreativeWork",
    projectListing: "ItemList",
    product: "Product",
    productListing: "ItemList",
    post: "Article",
    postListing: "ItemList",
    service: "Service",
    serviceListing: "ItemList",
};

export interface SchemaConfigBase {
    schemaType: SchemaPageType;
    schemaConfig?: Record<string, unknown>;
    fieldMapping?: Record<string, string>;
}

export const getSchemaType = (pageType: SchemaPageType): string => {
    return SCHEMA_TYPE_MAP[pageType] || "WebPage";
};

export const isListingSchema = (pageType: SchemaPageType): boolean => {
    return pageType.endsWith("Listing");
};

export const isDetailSchema = (pageType: SchemaPageType): boolean => {
    const detailTypes: SchemaPageType[] = ["product", "post", "service", "project"];
    return detailTypes.includes(pageType);
};

export const isStaticSchema = (pageType: SchemaPageType): boolean => {
    const staticTypes: SchemaPageType[] = ["home", "about", "contact", "faq"];
    return staticTypes.includes(pageType);
};
