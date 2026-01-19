/** Product Detail Page Schema - Product và Breadcrumb */

export interface Brand {
    "@type": "Brand";
    name: string;
}

export type AvailabilityType = "https://schema.org/InStock" | "https://schema.org/OutOfStock";

export interface Offer {
    "@type": "Offer";
    url: string;
    priceCurrency: string;
    price: number;
    priceValidUntil: string;
    availability: AvailabilityType;
    itemCondition: "https://schema.org/NewCondition";
}

export interface AggregateRating {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
    bestRating: number;
    worstRating: number;
}

export interface ReviewRating {
    "@type": "Rating";
    ratingValue: number;
    bestRating: number;
}

export interface ReviewAuthor {
    "@type": "Person";
    name: string;
}

export interface Review {
    "@type": "Review";
    author: ReviewAuthor;
    datePublished: string;
    reviewRating: ReviewRating;
    reviewBody: string;
}

export interface ProductSchema {
    "@context": "https://schema.org";
    "@type": "Product";
    name: string;
    description: string;
    image: string[];
    sku: string;
    brand: Brand;
    offers: Offer;
    aggregateRating: AggregateRating;
    review: Review[];
}

export interface ListItem {
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
}

export interface BreadcrumbListSchema {
    "@context": "https://schema.org";
    "@type": "BreadcrumbList";
    itemListElement: ListItem[];
}
