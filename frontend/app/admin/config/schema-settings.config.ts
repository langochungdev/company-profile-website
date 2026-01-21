/** Schema Settings Config - Auto-discover từ schema-settings folder */

import type { SchemaPageType } from "@/admin/types/schema";
import type { SchemaFieldsConfig, SettingsFieldConfig } from "@/admin/config/settings.config";

interface SchemaSettingsModule {
    schemaKey: string;
    schemaSettings: SchemaFieldsConfig;
    aliases?: string[];
}

const modules = import.meta.glob("./schema-settings/*.settings.ts", { eager: true });

const SCHEMA_FIELDS_MAP: Record<string, SchemaFieldsConfig> = {};
const DEFAULT_SCHEMA_FIELDS: SchemaFieldsConfig = { config: {}, fieldMapping: {} };

Object.values(modules).forEach((mod) => {
    const m = mod as SchemaSettingsModule;
    if (!m?.schemaKey || !m?.schemaSettings) return;

    SCHEMA_FIELDS_MAP[m.schemaKey] = m.schemaSettings;

    m.aliases?.forEach((alias) => {
        SCHEMA_FIELDS_MAP[alias] = m.schemaSettings;
    });
});

export function getSchemaFields(schemaType: SchemaPageType): SchemaFieldsConfig {
    return SCHEMA_FIELDS_MAP[schemaType] || DEFAULT_SCHEMA_FIELDS;
}

export function getSchemaConfigFields(schemaType: SchemaPageType): Record<string, SettingsFieldConfig> {
    return SCHEMA_FIELDS_MAP[schemaType]?.config || {};
}

export function getSchemaFieldMappingFields(schemaType: SchemaPageType): Record<string, SettingsFieldConfig> {
    return SCHEMA_FIELDS_MAP[schemaType]?.fieldMapping || {};
}

export { SCHEMA_FIELDS_MAP };
