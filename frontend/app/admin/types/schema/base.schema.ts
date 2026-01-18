// Base schema types cho tất cả JSON-LD schemas

export interface BaseSchema {
    "@context": "https://schema.org";
    "@type": string;
}

export interface ThingSchema extends BaseSchema {
    name: string;
    description?: string;
    url?: string;
    image?: string | ImageSchema;
}

export interface ImageSchema {
    "@type": "ImageObject";
    url: string;
    width?: number;
    height?: number;
    caption?: string;
}

export interface OrganizationSchema extends BaseSchema {
    "@type": "Organization";
    name: string;
    url?: string;
    logo?: string | ImageSchema;
    sameAs?: string[];
    contactPoint?: ContactPointSchema;
    address?: PostalAddressSchema;
}

export interface ContactPointSchema {
    "@type": "ContactPoint";
    telephone?: string;
    email?: string;
    contactType?: string;
    areaServed?: string;
    availableLanguage?: string[];
}

export interface PostalAddressSchema {
    "@type": "PostalAddress";
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
}

export interface BreadcrumbSchema extends BaseSchema {
    "@type": "BreadcrumbList";
    itemListElement: BreadcrumbItemSchema[];
}

export interface BreadcrumbItemSchema {
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
}

export interface PersonSchema extends BaseSchema {
    "@type": "Person";
    name: string;
    url?: string;
    image?: string;
    jobTitle?: string;
}

export interface MonetaryAmountSchema {
    "@type": "MonetaryAmount";
    currency: string;
    value: number;
}

export interface OfferSchema {
    "@type": "Offer";
    price: number;
    priceCurrency: string;
    availability?: "InStock" | "OutOfStock" | "PreOrder" | "Discontinued";
    url?: string;
    validFrom?: string;
    validThrough?: string;
}

export interface AggregateRatingSchema {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
}

export const createBreadcrumb = (items: { name: string; url?: string }[]): BreadcrumbSchema => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
    })),
});
