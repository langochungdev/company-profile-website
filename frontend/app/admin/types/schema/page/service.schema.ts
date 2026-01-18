// Schema types cho Service pages (Detail + Listing)

import type { BaseSchema, OrganizationSchema, OfferSchema, AggregateRatingSchema, ImageSchema, BreadcrumbSchema, PostalAddressSchema } from "../base.schema";

export interface ServiceDetailSchema extends BaseSchema {
    "@type": "Service" | "ProfessionalService" | "FinancialService" | "GovernmentService";
    "@id"?: string;
    name: string;
    description?: string;
    image?: string | ImageSchema;
    url?: string;
    provider?: OrganizationSchema;
    serviceType?: string;
    category?: string;
    areaServed?: string | string[] | GeoShapeSchema | PostalAddressSchema;
    audience?: AudienceSchema;
    availableChannel?: ServiceChannelSchema;
    brand?: { "@type": "Brand"; name: string };
    broker?: OrganizationSchema;
    hoursAvailable?: OpeningHoursSpecificationSchema;
    offers?: OfferSchema | OfferSchema[];
    aggregateRating?: AggregateRatingSchema;
    review?: ServiceReviewSchema[];
    termsOfService?: string;
    serviceOutput?: string;
    produces?: string;
    isRelatedTo?: ServiceDetailSchema[];
    isSimilarTo?: ServiceDetailSchema[];
}

export interface GeoShapeSchema {
    "@type": "GeoShape";
    addressCountry?: string;
    postalCode?: string;
}

export interface AudienceSchema {
    "@type": "Audience";
    audienceType: string;
    geographicArea?: string;
}

export interface ServiceChannelSchema {
    "@type": "ServiceChannel";
    serviceUrl?: string;
    servicePhone?: string;
    serviceSmsNumber?: string;
    serviceLocation?: PostalAddressSchema;
}

export interface OpeningHoursSpecificationSchema {
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string | string[];
    opens: string;
    closes: string;
}

export interface ServiceReviewSchema {
    "@type": "Review";
    author: { "@type": "Person"; name: string };
    datePublished?: string;
    reviewBody?: string;
    reviewRating?: {
        "@type": "Rating";
        ratingValue: number;
        bestRating?: number;
    };
}

export interface ServiceListingSchema extends BaseSchema {
    "@type": "ItemList";
    name: string;
    description?: string;
    numberOfItems: number;
    itemListElement: ServiceListItemSchema[];
    itemListOrder?: "Ascending" | "Descending" | "Unordered";
}

export interface ServiceListItemSchema {
    "@type": "ListItem";
    position: number;
    url?: string;
    item: ServiceDetailSchema;
}

export interface ServiceCollectionSchema extends BaseSchema {
    "@type": "CollectionPage";
    "@id"?: string;
    name: string;
    description?: string;
    url?: string;
    breadcrumb?: BreadcrumbSchema;
    mainEntity: ServiceListingSchema;
}

export interface OfferCatalogSchema extends BaseSchema {
    "@type": "OfferCatalog";
    name: string;
    description?: string;
    itemListElement: ServiceDetailSchema[] | OfferSchema[];
}

export interface ServiceSchemaConfig {
    type?: "Service" | "ProfessionalService" | "FinancialService";
    includeProvider?: boolean;
    includeAreaServed?: boolean;
    includeOffers?: boolean;
    includeRating?: boolean;
    includeHours?: boolean;
    providerName?: string;
    areaServed?: string;
}

export const DEFAULT_SERVICE_SCHEMA_CONFIG: ServiceSchemaConfig = {
    type: "ProfessionalService",
    includeProvider: true,
    includeAreaServed: true,
    includeOffers: false,
    includeRating: false,
    includeHours: false,
    areaServed: "VN",
};

export interface ServiceSchemaFieldMapping {
    name: string;
    description?: string;
    image?: string;
    serviceType?: string;
    price?: string;
}

export const DEFAULT_SERVICE_FIELD_MAPPING: ServiceSchemaFieldMapping = {
    name: "name",
    description: "description",
    image: "image",
    serviceType: "category",
};
