/** FAQ Page Schema Settings */

import { COMMON_SCHEMA_CONFIG, type SchemaFieldsConfig } from "@/admin/config/settings.config";

export const schemaKey = "faq";

export const schemaSettings: SchemaFieldsConfig = {
    config: {
        ...COMMON_SCHEMA_CONFIG,
    },
    fieldMapping: {
        question: {
            type: "text",
            label: "Field: Câu hỏi",
            default: "question",
        },
        answer: {
            type: "text",
            label: "Field: Trả lời",
            default: "answer",
        },
    },
};
