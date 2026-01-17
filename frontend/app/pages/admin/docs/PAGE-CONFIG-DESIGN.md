# PAGE CONFIG DESIGN - HỆ THỐNG CẤU HÌNH ADMIN ĐỘNG

> **Mục đích:** Quy ước cấu hình để Admin Panel render form CRUD động từ config files.
> **Audience:** Developer, Agent AI khi tạo page mới.

---

## 1. OVERVIEW

Admin panel đọc config → render form động → CRUD dữ liệu lên Firestore.

```
Config Files → page.config.ts (Registry) → Admin Panel → Firestore
```

**Lợi ích:** Tái sử dụng admin cho website khác, chỉ cần config đúng format.

---

## 2. TWO-TIER CONFIG MODEL

Hệ thống chia làm **2 loại config** với mục đích khác nhau:

| Loại                | Mục đích                                        | Naming Pattern           | Ví dụ                                 |
| ------------------- | ----------------------------------------------- | ------------------------ | ------------------------------------- |
| **PAGE CONFIG**     | Định nghĩa sections hiển thị trên frontend page | `<page>.config.ts`       | `home.config.ts`, `product.config.ts` |
| **METADATA CONFIG** | Schema dữ liệu của 1 item (form CRUD)           | `<page>Detail.config.ts` | `productDetail.config.ts`             |

### 2.1 Khi nào dùng loại nào?

| Tình huống                                        | Loại config                   | Type                      |
| ------------------------------------------------- | ----------------------------- | ------------------------- |
| Trang tĩnh (Home, About) - chỉ có sections        | PAGE CONFIG                   | `type: "page"` (default)  |
| Trang danh sách (Products, Posts) - có list items | PAGE CONFIG + METADATA CONFIG | `type: "collection"`      |
| Config toàn site (SEO, Settings)                  | PAGE CONFIG                   | Đặt trong `admin/config/` |

### 2.2 Cấu trúc thư mục

```
pages/
├── home/
│   ├── Home.vue
│   └── home.config.ts              ← PAGE CONFIG
├── product/
│   ├── Product.vue
│   ├── product.config.ts           ← PAGE CONFIG (type: collection)
│   └── productDetail.config.ts     ← METADATA CONFIG
└── admin/
    ├── page.config.ts              ← REGISTRY (import all configs)
    └── config/
        └── seoOpenGraph.config.ts  ← GLOBAL CONFIG
```

---

## 3. PAGE CONFIG SPEC

### 3.1 Interface

```typescript
interface PageConfig {
    // Required
    page: string; // ID duy nhất, dùng cho route
    pageName: string; // Tên hiển thị trên sidebar admin
    path: string; // Firestore path (collection/document)
    icon: string; // MDI icon (mdi:home, mdi:package-variant)
    order: number; // Thứ tự hiển thị sidebar
    sections: Record<string, SectionConfig>;

    // Optional
    group?: string; // Nhóm sidebar (default: "Trang")
    type?: "page" | "collection"; // Default: "page"
    itemConfig?: ItemConfig; // Chỉ khi type = "collection"
}
```

### 3.2 Ví dụ PAGE CONFIG (type: page)

```typescript
// home.config.ts
export const homeConfig = {
    page: "home",
    pageName: "Trang chủ",
    path: "pages/home",
    icon: "mdi:home",
    order: 1,
    group: "Trang",

    sections: {
        hero: {
            label: "Banner Slideshow",
            collapsed: false,
            visible: true,
            fields: {
                slides: {
                    type: "array",
                    label: "Danh sách slide",
                    exact: 3,
                    sortable: true,
                    schema: {
                        title: { type: "text", label: "Tiêu đề", max: 50, required: true },
                        image: { type: "image", label: "Ảnh nền", note: "1920x1080" },
                    },
                },
            },
        },
    },
};
```

### 3.3 Ví dụ PAGE CONFIG (type: collection)

```typescript
// product.config.ts
export const productPageConfig = {
    page: "product",
    pageName: "Sản phẩm",
    path: "pages/product",
    icon: "mdi:package-variant",
    order: 3,

    type: "collection",
    itemConfig: {
        name: "sản phẩm",
        namePlural: "Sản phẩm",
        icon: "mdi:package-variant",
        config: productDetailConfig, // ← Import METADATA CONFIG
        data: PRODUCTS, // ← Mock data hoặc []
    },

    sections: {
        settings: {
            label: "Cài đặt trang",
            fields: {
                pageTitle: { type: "text", label: "Tiêu đề trang", max: 60 },
                productsPerPage: { type: "number", label: "Số SP/trang", min: 6, max: 24, default: 12 },
            },
        },
    },
};
```

---

## 4. METADATA CONFIG SPEC

Dùng cho collection pages, định nghĩa schema của từng item.

### 4.1 Interface

```typescript
interface MetadataConfig {
    sections: Record<string, SectionConfig>; // Form sections
    tableColumns: TableColumn[]; // Columns hiển thị trong list
    defaultValues: Record<string, unknown>; // Giá trị mặc định
}

interface TableColumn {
    key: string;
    label: string;
    type: "text" | "image" | "badge" | "currency" | "date";
    width?: number;
}
```

### 4.2 Ví dụ METADATA CONFIG

```typescript
// productDetail.config.ts
export const productDetailConfig = {
    sections: {
        basic: {
            label: "Thông tin cơ bản",
            collapsed: false,
            fields: {
                name: { type: "text", label: "Tên sản phẩm", max: 100, required: true },
                category: { type: "select", label: "Danh mục", options: ["Camera AI", "WiFi", "Switch"] },
                price: { type: "number", label: "Giá (VNĐ)", min: 0 },
            },
        },
        media: {
            label: "Hình ảnh",
            collapsed: true,
            fields: {
                image: { type: "image", label: "Ảnh chính", note: "800x800px", required: true },
            },
        },
    },

    tableColumns: [
        { key: "image", label: "", type: "image", width: 60 },
        { key: "name", label: "Tên sản phẩm", type: "text" },
        { key: "category", label: "Danh mục", type: "badge" },
        { key: "price", label: "Giá", type: "currency" },
    ],

    defaultValues: {
        name: "",
        category: "",
        price: 0,
        image: "",
    },
};
```

---

## 5. SECTION CONFIG

### 5.1 Interface

```typescript
interface SectionConfig {
    label: string; // Tên hiển thị
    collapsed?: boolean; // Mặc định thu gọn? (default: false)
    visible?: boolean; // Hiển thị trên frontend? (default: true)
    fields: Record<string, FieldConfig>;
}
```

### 5.2 Quy tắc

| Property    | Mô tả                                          | Default |
| ----------- | ---------------------------------------------- | ------- |
| `label`     | **Bắt buộc.** Tên section hiển thị trên admin  | -       |
| `collapsed` | Section thu gọn mặc định khi mở form           | `false` |
| `visible`   | Dùng để control hiển thị section trên frontend | `true`  |

---

## 6. FIELD TYPES REFERENCE

### 6.1 Tất cả Field Types

| Type       | Component       | Mô tả            | Props đặc biệt                              |
| ---------- | --------------- | ---------------- | ------------------------------------------- |
| `text`     | TextInput       | Input 1 dòng     | `max`, `placeholder`                        |
| `textarea` | TextareaInput   | Input nhiều dòng | `max`, `rows`                               |
| `richtext` | RichTextEditor  | WYSIWYG editor   | `toolbar`, `placeholder`                    |
| `number`   | NumberInput     | Input số         | `min`, `max`, `step`                        |
| `boolean`  | BooleanCheckbox | Checkbox         | -                                           |
| `select`   | SelectDropdown  | Dropdown         | `options`                                   |
| `image`    | ImageUploader   | Upload ảnh       | `note` (size hint)                          |
| `video`    | VideoUploader   | Upload video/URL | `accept`                                    |
| `date`     | DatePicker      | Chọn ngày        | -                                           |
| `color`    | ColorPicker     | Chọn màu         | -                                           |
| `array`    | ArrayEditor     | Danh sách items  | `min`, `max`, `exact`, `sortable`, `schema` |
| `group`    | FieldGroup      | Nhóm fields      | `fields`                                    |

### 6.2 Props chung tất cả fields

```typescript
interface FieldConfig {
    type: FieldType; // Bắt buộc
    label: string; // Bắt buộc
    note?: string; // Ghi chú hướng dẫn
    required?: boolean; // Bắt buộc nhập
    default?: any; // Giá trị mặc định
    placeholder?: string; // Placeholder text
    showIf?: {
        // Conditional display
        field: string;
        value: string | boolean | string[];
    };
}
```

### 6.3 Array Field

```typescript
// Số lượng linh hoạt (min/max)
items: {
    type: "array",
    min: 3,           // Tối thiểu 3 items
    max: 10,          // Tối đa 10 items
    sortable: true,   // Cho phép kéo thả
    schema: { ... }
}

// Số lượng cố định (exact)
slides: {
    type: "array",
    exact: 3,         // Luôn đúng 3 items
    sortable: true,
    schema: { ... }
}
```

### 6.4 Select Field

```typescript
// Options đơn giản
category: {
    type: "select",
    options: ["Camera AI", "WiFi", "Switch"],
    default: "Camera AI"
}

// Options với value/label
status: {
    type: "select",
    options: [
        { value: "draft", label: "Bản nháp" },
        { value: "published", label: "Đã xuất bản" }
    ]
}
```

---

## 7. WORKFLOW: THÊM PAGE MỚI

### 7.1 Thêm Page tĩnh (type: page)

```bash
# 1. Tạo config file
pages/<page-name>/<page-name>.config.ts

# 2. Export config với đầy đủ fields
export const <pageName>Config = {
    page: "<page-name>",
    pageName: "Tên hiển thị",
    path: "pages/<page-name>",
    icon: "mdi:icon-name",
    order: N,
    sections: { ... }
}

# 3. Import vào page.config.ts
import { <pageName>Config } from "@/pages/<page-name>/<page-name>.config";
SIDEBAR_PAGES.push({ key: "<page-name>", config: <pageName>Config });
```

### 7.2 Thêm Page danh sách (type: collection)

```bash
# 1. Tạo METADATA CONFIG trước
pages/<page-name>/<page-name>Detail.config.ts

# 2. Tạo PAGE CONFIG, import metadata
pages/<page-name>/<page-name>.config.ts
→ type: "collection"
→ itemConfig.config: <pageName>DetailConfig

# 3. Import vào page.config.ts
```

### 7.3 Checklist

-   [ ] `page` ID unique
-   [ ] `path` đúng format Firestore
-   [ ] `icon` sử dụng MDI format (mdi:xxx)
-   [ ] `sections` có ít nhất 1 section
-   [ ] Mỗi field có `type` và `label`
-   [ ] Array fields có `schema`
-   [ ] Import vào `page.config.ts`

---

## 8. QUICK REFERENCE

### File Locations

| Loại            | Đường dẫn                             |
| --------------- | ------------------------------------- |
| PAGE CONFIG     | `pages/<page>/<page>.config.ts`       |
| METADATA CONFIG | `pages/<page>/<page>Detail.config.ts` |
| GLOBAL CONFIG   | `admin/config/*.config.ts`            |
| REGISTRY        | `admin/page.config.ts`                |

### Naming Conventions

| Thành phần  | Convention           | Ví dụ                      |
| ----------- | -------------------- | -------------------------- |
| Config file | kebab-case.config.ts | `product-detail.config.ts` |
| Export name | camelCase + Config   | `productDetailConfig`      |
| Page ID     | kebab-case           | `product`, `blog-post`     |
| Section ID  | camelCase            | `hero`, `contactInfo`      |
| Field ID    | camelCase            | `pageTitle`, `ogImage`     |

### TypeScript Types

```typescript
// Import từ page.config.ts
import type { PageConfig, SectionConfig, FieldConfig, TableColumn } from "@/pages/admin/page.config";
```

---

## 9. ANTI-PATTERNS

❌ **KHÔNG LÀM:**

```typescript
// Quá nhiều nested array (> 2 levels)
items: { type: "array", schema: {
    sub: { type: "array", schema: {
        deep: { type: "array" } // ❌ Quá sâu
    }}
}}

// Field name có space hoặc ký tự đặc biệt
"my field": { ... }  // ❌
"my-field": { ... }  // ❌
myField: { ... }     // ✅

// Thiếu label
title: { type: "text" }  // ❌ Thiếu label
title: { type: "text", label: "Tiêu đề" }  // ✅

// Array không có schema
items: { type: "array", min: 1, max: 5 }  // ❌ Thiếu schema
```

---

**Cập nhật lần cuối:** 2026-01-16
