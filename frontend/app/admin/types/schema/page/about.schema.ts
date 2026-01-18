// Schema types cho About Page

import type { BaseSchema, OrganizationSchema, BreadcrumbSchema, ImageSchema, PersonSchema, PostalAddressSchema } from "../base.schema";

export interface AboutPageSchema extends BaseSchema {
    "@type": "AboutPage";
    "@id"?: string;
    name: string;
    description?: string;
    url?: string;
    breadcrumb?: BreadcrumbSchema;
    mainEntity?: OrganizationDetailSchema;
    primaryImageOfPage?: ImageSchema;
}

export interface OrganizationDetailSchema extends OrganizationSchema {
    foundingDate?: string;
    founder?: PersonSchema | PersonSchema[];
    numberOfEmployees?: NumberOfEmployeesSchema;
    slogan?: string;
    description?: string;
    award?: string[];
    knowsAbout?: string[];
    member?: PersonSchema[];
    employee?: PersonSchema[];
    department?: OrganizationSchema[];
    parentOrganization?: OrganizationSchema;
    address?: PostalAddressSchema;
    areaServed?: string | string[];
}

export interface NumberOfEmployeesSchema {
    "@type": "QuantitativeValue";
    value?: number;
    minValue?: number;
    maxValue?: number;
}

export interface TeamMemberSchema extends PersonSchema {
    worksFor?: OrganizationSchema;
    photo?: ImageSchema;
    email?: string;
    telephone?: string;
    sameAs?: string[];
    affiliation?: OrganizationSchema;
}

export interface CompanyHistorySchema {
    "@type": "Event";
    name: string;
    description?: string;
    startDate: string;
    endDate?: string;
    location?: string;
}

export interface AboutSchemaConfig {
    includeFounder?: boolean;
    includeTeam?: boolean;
    includeHistory?: boolean;
    includeAwards?: boolean;
    includeDepartments?: boolean;
}

export const DEFAULT_ABOUT_SCHEMA_CONFIG: AboutSchemaConfig = {
    includeFounder: true,
    includeTeam: true,
    includeHistory: false,
    includeAwards: true,
    includeDepartments: false,
};

export interface AboutSchemaFieldMapping {
    name: string;
    description?: string;
    foundingDate?: string;
    founderName?: string;
    employeeCount?: string;
    slogan?: string;
}

export const DEFAULT_ABOUT_FIELD_MAPPING: AboutSchemaFieldMapping = {
    name: "companyName",
    description: "companyDescription",
    foundingDate: "foundingDate",
    founderName: "founderName",
    employeeCount: "employeeCount",
};
