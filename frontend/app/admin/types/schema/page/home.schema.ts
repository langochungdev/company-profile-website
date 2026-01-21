/**
 * Home Page Schema - Specific cho trang chủ
 */

import type { GlobalSchemaConfig } from "../global.schema";

/**
 * Home hiện tại chỉ cần global schema
 * File này dành cho extend sau nếu cần thêm
 */

export interface HomeSchemaConfig {
    global?: GlobalSchemaConfig;
    // Thêm schema đặc thù cho home nếu cần
    // breadcrumb?: BreadcrumbSchema;
    // featuredItems?: ItemListSchema;
}
