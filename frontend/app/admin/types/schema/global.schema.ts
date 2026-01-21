/**
 * Global Schema - Xuất hiện trên mọi trang
 */

export interface PostalAddressSchema {
    "@type": "PostalAddress";
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
}

export interface OrganizationSchema {
    "@context": "https://schema.org";
    "@type": "Organization";
    name: string;
    url: string;
    logo?: string;
    description?: string;
    telephone?: string;
    email?: string;
    address?: PostalAddressSchema;
    foundingDate?: string;
    numberOfEmployees?: string;
    sameAs?: string[]; // Social links
}

export interface SearchActionSchema {
    "@type": "SearchAction";
    target: {
        "@type": "EntryPoint";
        urlTemplate: string;
    };
    "query-input": string;
}

export interface WebSiteSchema {
    "@context": "https://schema.org";
    "@type": "WebSite";
    name: string;
    url: string;
    description?: string;
    inLanguage?: string;
    potentialAction?: SearchActionSchema;
}

export interface GlobalSchemaConfig {
    organization: Omit<OrganizationSchema, "@context" | "@type">;
    website: Omit<WebSiteSchema, "@context" | "@type">;
}
