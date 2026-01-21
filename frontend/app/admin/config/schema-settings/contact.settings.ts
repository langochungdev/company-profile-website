/** Contact Page Schema Settings */

import { COMMON_SCHEMA_CONFIG, type SchemaFieldsConfig } from "@/admin/config/settings.config";

export const schemaKey = "contact";

export const schemaSettings: SchemaFieldsConfig = {
    config: {
        ...COMMON_SCHEMA_CONFIG,
        telephone: {
            type: "text",
            label: "Số điện thoại",
            note: "Số điện thoại liên hệ chính",
        },
        email: {
            type: "text",
            label: "Email",
            note: "Email liên hệ chính",
        },
        address: {
            type: "textarea",
            label: "Địa chỉ",
            rows: 2,
        },
        openingHours: {
            type: "text",
            label: "Giờ mở cửa",
            note: "VD: Mo-Fr 08:00-17:00",
        },
    },
    fieldMapping: {},
};
