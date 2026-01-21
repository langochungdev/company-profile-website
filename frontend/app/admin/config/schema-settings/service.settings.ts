/** Service Schema Settings */

import { COMMON_SCHEMA_CONFIG, type SchemaFieldsConfig } from "@/admin/config/settings.config";

export const schemaKey = "service";

export const schemaSettings: SchemaFieldsConfig = {
    config: {
        ...COMMON_SCHEMA_CONFIG,
        serviceType: {
            type: "select",
            label: "Loại dịch vụ",
            options: [
                { value: "Service", label: "Service" },
                { value: "ProfessionalService", label: "Professional Service" },
            ],
            default: "ProfessionalService",
        },
        providerName: {
            type: "text",
            label: "Tên nhà cung cấp",
            default: "SHT Security",
        },
        areaServed: {
            type: "text",
            label: "Khu vực phục vụ",
            default: "Việt Nam",
        },
    },
    fieldMapping: {
        name: {
            type: "text",
            label: "Field: Tên dịch vụ",
            default: "title",
        },
        description: {
            type: "text",
            label: "Field: Mô tả",
            default: "description",
        },
        image: {
            type: "text",
            label: "Field: Hình ảnh",
            default: "thumbnail",
        },
    },
};

export const aliases = ["serviceListing"];
