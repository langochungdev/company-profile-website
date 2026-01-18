// Schema types cho FAQ Page

import type { BaseSchema, BreadcrumbSchema } from "../base.schema";

export interface FAQPageSchema extends BaseSchema {
    "@type": "FAQPage";
    "@id"?: string;
    name?: string;
    description?: string;
    url?: string;
    breadcrumb?: BreadcrumbSchema;
    mainEntity: QuestionSchema[];
}

export interface QuestionSchema {
    "@type": "Question";
    name: string;
    acceptedAnswer: AnswerSchema;
    dateCreated?: string;
    author?: { "@type": "Person" | "Organization"; name: string };
    upvoteCount?: number;
}

export interface AnswerSchema {
    "@type": "Answer";
    text: string;
    dateCreated?: string;
    author?: { "@type": "Person" | "Organization"; name: string };
    upvoteCount?: number;
    url?: string;
}

export interface HowToSchema extends BaseSchema {
    "@type": "HowTo";
    name: string;
    description?: string;
    image?: string;
    totalTime?: string;
    estimatedCost?: { "@type": "MonetaryAmount"; currency: string; value: number };
    supply?: HowToSupplySchema[];
    tool?: HowToToolSchema[];
    step: HowToStepSchema[];
}

export interface HowToStepSchema {
    "@type": "HowToStep";
    name: string;
    text: string;
    url?: string;
    image?: string;
}

export interface HowToSupplySchema {
    "@type": "HowToSupply";
    name: string;
}

export interface HowToToolSchema {
    "@type": "HowToTool";
    name: string;
}

export interface FAQSchemaConfig {
    includeAuthor?: boolean;
    includeDateCreated?: boolean;
    maxQuestions?: number;
}

export const DEFAULT_FAQ_SCHEMA_CONFIG: FAQSchemaConfig = {
    includeAuthor: false,
    includeDateCreated: false,
    maxQuestions: 20,
};

export interface FAQSchemaFieldMapping {
    question: string;
    answer: string;
    category?: string;
}

export const DEFAULT_FAQ_FIELD_MAPPING: FAQSchemaFieldMapping = {
    question: "question",
    answer: "answer",
};
