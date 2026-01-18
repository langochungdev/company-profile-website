// Schema types cho Product pages (Detail + Listing)

import type { BaseSchema, OrganizationSchema, OfferSchema, AggregateRatingSchema, ImageSchema, BreadcrumbSchema } from "../base.schema";

export interface ProductDetailSchema extends BaseSchema {
    "@type": "Product";
    "@id"?: string;
    name: string;
    description?: string;
    image?: string | string[] | ImageSchema[];
    sku?: string;
    mpn?: string;
    gtin13?: string;
    gtin8?: string;
    brand?: OrganizationSchema | { "@type": "Brand"; name: string };
    manufacturer?: OrganizationSchema;
    offers?: OfferSchema | OfferSchema[];
    aggregateRating?: AggregateRatingSchema;
    review?: ReviewSchema[];
    category?: string;
    color?: string;
    material?: string;
    size?: string;
    weight?: QuantitativeValueSchema;
    width?: QuantitativeValueSchema;
    height?: QuantitativeValueSchema;
    depth?: QuantitativeValueSchema;
    model?: string;
    releaseDate?: string;
    productionDate?: string;
    countryOfOrigin?: string;
    isAccessoryOrSparePartFor?: ProductDetailSchema;
    isSimilarTo?: ProductDetailSchema[];
    isRelatedTo?: ProductDetailSchema[];
}

export interface QuantitativeValueSchema {
    "@type": "QuantitativeValue";
    value: number;
    unitCode?: string;
    unitText?: string;
}

export interface ReviewSchema {
    "@type": "Review";
    author: { "@type": "Person"; name: string };
    datePublished?: string;
    reviewBody?: string;
    reviewRating?: {
        "@type": "Rating";
        ratingValue: number;
        bestRating?: number;
        worstRating?: number;
    };
}

export interface ProductListingSchema extends BaseSchema {
    "@type": "ItemList";
    name: string;
    description?: string;
    numberOfItems: number;
    itemListElement: ProductListItemSchema[];
    itemListOrder?: "Ascending" | "Descending" | "Unordered";
}

export interface ProductListItemSchema {
    "@type": "ListItem";
    position: number;
    url?: string;
    item: ProductDetailSchema;
}

export interface ProductCollectionSchema extends BaseSchema {
    "@type": "CollectionPage";
    "@id"?: string;
    name: string;
    description?: string;
    url?: string;
    breadcrumb?: BreadcrumbSchema;
    mainEntity: ProductListingSchema;
}

export interface ProductCategorySchema extends BaseSchema {
    "@type": "ProductGroup" | "Brand";
    name: string;
    description?: string;
    url?: string;
    image?: string | ImageSchema;
    hasVariant?: ProductDetailSchema[];
}

export interface ProductSchemaConfig {
    includeBrand?: boolean;
    includeOffers?: boolean;
    includeRating?: boolean;
    includeReviews?: boolean;
    includeSpecifications?: boolean;
    brandName?: string;
    currency?: string;
    availability?: "InStock" | "OutOfStock" | "PreOrder";
}

export const DEFAULT_PRODUCT_SCHEMA_CONFIG: ProductSchemaConfig = {
    includeBrand: true,
    includeOffers: true,
    includeRating: false,
    includeReviews: false,
    includeSpecifications: true,
    currency: "VND",
    availability: "InStock",
};

export interface ProductSchemaFieldMapping {
    name: string;
    description?: string;
    image?: string;
    price?: string;
    sku?: string;
    category?: string;
    brand?: string;
}

export const DEFAULT_PRODUCT_FIELD_MAPPING: ProductSchemaFieldMapping = {
    name: "name",
    description: "description",
    image: "image",
    price: "price",
    sku: "sku",
    category: "category",
};
