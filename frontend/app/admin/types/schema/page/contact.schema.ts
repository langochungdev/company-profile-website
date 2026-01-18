// Schema types cho Contact Page

import type { BaseSchema, OrganizationSchema, BreadcrumbSchema, ImageSchema, PostalAddressSchema, ContactPointSchema } from "../base.schema";

export interface ContactPageSchema extends BaseSchema {
    "@type": "ContactPage";
    "@id"?: string;
    name: string;
    description?: string;
    url?: string;
    breadcrumb?: BreadcrumbSchema;
    mainEntity?: LocalBusinessSchema;
    primaryImageOfPage?: ImageSchema;
}

export interface LocalBusinessSchema extends BaseSchema {
    "@type": "LocalBusiness" | "ProfessionalService" | "Store" | "Corporation";
    "@id"?: string;
    name: string;
    description?: string;
    image?: string | ImageSchema;
    url?: string;
    telephone?: string;
    email?: string;
    address?: PostalAddressSchema;
    geo?: GeoCoordinatesSchema;
    openingHoursSpecification?: OpeningHoursSchema[];
    priceRange?: string;
    paymentAccepted?: string[];
    currenciesAccepted?: string;
    contactPoint?: ContactPointSchema | ContactPointSchema[];
    sameAs?: string[];
    hasMap?: string;
    areaServed?: string | string[];
}

export interface GeoCoordinatesSchema {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
}

export interface OpeningHoursSchema {
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string | string[];
    opens: string;
    closes: string;
    validFrom?: string;
    validThrough?: string;
}

export interface ContactSchemaConfig {
    businessType?: "LocalBusiness" | "ProfessionalService" | "Store" | "Corporation";
    includeGeo?: boolean;
    includeOpeningHours?: boolean;
    includeContactPoints?: boolean;
    includeSocialLinks?: boolean;
    includeMap?: boolean;
}

export const DEFAULT_CONTACT_SCHEMA_CONFIG: ContactSchemaConfig = {
    businessType: "ProfessionalService",
    includeGeo: true,
    includeOpeningHours: true,
    includeContactPoints: true,
    includeSocialLinks: true,
    includeMap: true,
};

export interface ContactSchemaFieldMapping {
    name: string;
    telephone?: string;
    email?: string;
    streetAddress?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    latitude?: string;
    longitude?: string;
    mapUrl?: string;
}

export const DEFAULT_CONTACT_FIELD_MAPPING: ContactSchemaFieldMapping = {
    name: "companyName",
    telephone: "phone",
    email: "email",
    streetAddress: "address",
    city: "city",
    country: "country",
};
