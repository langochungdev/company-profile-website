/** Product List Page Schema - CollectionPage */

export interface ListItem {
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
}

export interface BreadcrumbList {
    "@type": "BreadcrumbList";
    itemListElement: ListItem[];
}

export interface CollectionPageSchema {
    "@context": "https://schema.org";
    "@type": "CollectionPage";
    name: string;
    description: string;
    url: string;
    breadcrumb: BreadcrumbList;
}
