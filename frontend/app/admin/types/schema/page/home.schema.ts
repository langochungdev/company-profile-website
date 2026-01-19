/** Home Page Schema - WebSite và Organization */

export interface SearchAction {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
}

export interface WebSiteSchema {
    "@context": "https://schema.org";
    "@type": "WebSite";
    name: string;
    url: string;
    potentialAction: SearchAction;
}

export interface PostalAddress {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
}

export interface ContactPoint {
    "@type": "ContactPoint";
    telephone: string;
    contactType: "customer service";
    email: string;
}

export interface OrganizationSchema {
    "@context": "https://schema.org";
    "@type": "Organization";
    name: string;
    url: string;
    logo: string;
    description: string;
    address: PostalAddress;
    contactPoint: ContactPoint;
    sameAs: string[];
}
