/** About Page Schema Settings */

import { COMMON_SCHEMA_CONFIG, type SchemaFieldsConfig } from "@/admin/config/settings.config";

export const schemaKey = "about";

export const schemaSettings: SchemaFieldsConfig = {
    config: {
        ...COMMON_SCHEMA_CONFIG,
        foundingDate: {
            type: "text",
            label: "Ngày thành lập",
            note: "Format: YYYY-MM-DD",
        },
        numberOfEmployees: {
            type: "text",
            label: "Số nhân viên",
        },
        legalName: {
            type: "text",
            label: "Tên pháp lý",
            note: "Tên đầy đủ pháp lý của công ty",
        },
    },
    fieldMapping: {},
};
