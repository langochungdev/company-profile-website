# 📋 PAGE CONFIG DESIGN - HỆ THỐNG CẤU HÌNH ADMIN ĐỘNG

> **⚠️ QUAN TRỌNG - PHÂN BIỆT 2 LOẠI CONFIG**

## 🔹 Cấu trúc thư mục

```
frontend/app/pages/
├── admin/
│   ├── config/                    ⭐ CORE ADMIN CONFIG (CỐ ĐỊNH - TÁI SỬ DỤNG)
│   │   ├── openGraph.config.ts    → Config chung cho Open Graph Meta
│   │   ├── seo.config.ts          → Config chung cho SEO Settings
│   │   └── general.config.ts      → Config chung cho General Settings
│   │
│   └── docs/
│       └── PAGE-CONFIG-DESIGN.md  → File này (hướng dẫn)
│
├── home/
│   ├── HomePage.vue
│   └── home.config.ts             🔧 PAGE CONFIG (LINH HOẠT - THAY ĐỔI THEO PROJECT)
│
├── about/
│   ├── AboutPage.vue
│   └── about.config.ts            🔧 PAGE CONFIG (LINH HOẠT - THAY ĐỔI THEO PROJECT)
│
└── product/
    ├── ProductPage.vue
    └── product.config.ts          🔧 PAGE CONFIG (LINH HOẠT - THAY ĐỔI THEO PROJECT)
```

---

## 🎯 Mục đích phân biệt

### 1️⃣ **`admin/config/*.config.ts`** - CORE ADMIN CONFIG (CỐ ĐỊNH)

**Đặc điểm:**

-   ✅ **Dùng chung cho TẤT CẢ các project**
-   ✅ **KHÔNG thay đổi** khi copy admin sang project khác
-   ✅ Định nghĩa cấu trúc config của toàn bộ hệ thống admin
-   ✅ Bao gồm: SEO, Open Graph, General Settings, Menu Config, v.v.

**VÍ DỤ:**

```typescript
// admin/config/openGraph.config.ts
export const openGraphConfig = {
    page: 'open-graph',
    sections: {
        basic: { ... },
        images: { ... },
        twitter: { ... }
    }
}
```

**💡 Khi tái sử dụng admin:**
→ Copy toàn bộ thư mục `admin/` sang project mới
→ **KHÔNG CẦN** sửa các file trong `admin/config/`

---

### 2️⃣ **`pages/<page-name>/<page-name>.config.ts`** - PAGE CONFIG (LINH HOẠT)

**Đặc điểm:**

-   🔧 **Riêng cho TỪNG PAGE** của từng project
-   🔧 **THAY ĐỔI** tùy theo nội dung trang
-   🔧 Mỗi trang có thể có cấu trúc sections khác nhau
-   🔧 Admin sẽ load config này để generate form động

**VÍ DỤ:**

```typescript
// pages/home/home.config.ts (Project A - Company Website)
export const homeConfig = {
    page: 'home',
    sections: {
        hero: { ... },
        services: { ... },
        testimonials: { ... }
    }
}

// pages/home/home.config.ts (Project B - E-commerce)
export const homeConfig = {
    page: 'home',
    sections: {
        slider: { ... },
        products: { ... },
        deals: { ... }
    }
}
```

**💡 Khi chuyển project:**
→ Copy thư mục `admin/` (giữ nguyên)
→ **SỬA/TẠO MỚI** các file `pages/<page>/<page>.config.ts` theo nhu cầu

---

## 📦 Workflow tái sử dụng admin

### Bước 1: Copy Admin Core

```bash
# Copy toàn bộ admin sang project mới
cp -r project-old/frontend/app/pages/admin project-new/frontend/app/pages/admin
```

### Bước 2: Tạo Page Configs cho project mới

```typescript
// project-new/frontend/app/pages/home/home.config.ts
export const homeConfig = {
    // Tùy chỉnh theo nhu cầu project mới
};
```

### Bước 3: Import vào Admin Registry

```typescript
// admin/page.config.ts (file tổng)
import { homeConfig } from "@/pages/home/home.config";
import { aboutConfig } from "@/pages/about/about.config";
// ... import các page config khác

export const PAGE_CONFIGS = {
    home: homeConfig,
    about: aboutConfig,
    // ...
};
```

---

## ✅ CHECKLIST khi tái sử dụng admin

-   [ ] Copy thư mục `admin/` → **KHÔNG SỬA** các file trong `admin/config/`
-   [ ] Tạo/Sửa các file `pages/<page>/<page>.config.ts` theo project mới
-   [ ] Cập nhật `admin/page.config.ts` để import các page config mới
-   [ ] Test admin panel xem có load đúng config không

---

## 🎨 VÍ DỤ HOÀN CHỈNH PAGE CONFIG

```typescript
// pages/product/product.config.ts - VÍ DỤ HOÀN CHỈNH

export const productPageConfig = {
    page: "product",
    path: "pages/product",

    sections: {
        // CASE 1: Section đơn giản với text và image
        hero: {
            label: "Banner sản phẩm",
            fields: {
                bg: { type: "image", label: "Ảnh nền", note: "1920x1080, max 5MB" },
                logo: { type: "image", label: "Logo", note: "PNG với nền trong suốt" },
                title: { type: "text", label: "Tiêu đề", max: 80, required: true },
                subtitle: { type: "textarea", label: "Mô tả ngắn", max: 200 },
            },
        },

        // CASE 2: Array đơn giản (list các item giống nhau)
        features: {
            label: "Tính năng",
            fields: {
                list: {
                    type: "array",
                    label: "Danh sách tính năng",
                    min: 3,
                    max: 8,
                    schema: {
                        icon: { type: "image", label: "Icon", note: "SVG 64x64" },
                        title: { type: "text", label: "Tiêu đề", max: 50 },
                        desc: { type: "textarea", label: "Mô tả", max: 150 },
                    },
                },
            },
        },

        // CASE 3: Nested array (array trong array)
        pricing: {
            label: "Bảng giá",
            fields: {
                plans: {
                    type: "array",
                    label: "Các gói",
                    min: 2,
                    max: 4,
                    schema: {
                        name: { type: "text", label: "Tên gói", required: true },
                        price: { type: "text", label: "Giá", note: "VD: 199.000đ/tháng" },
                        highlight: { type: "boolean", label: "Nổi bật?", default: false },
                        features: {
                            type: "array",
                            label: "Tính năng gói",
                            min: 1,
                            max: 10,
                            schema: {
                                text: { type: "text", label: "Nội dung", max: 100 },
                                available: { type: "boolean", label: "Có?", default: true },
                            },
                        },
                    },
                },
            },
        },

        // CASE 4: Group fields (nhóm các field liên quan)
        cta: {
            label: "Call to Action",
            fields: {
                enabled: { type: "boolean", label: "Hiển thị?", default: true },
                bg: { type: "image", label: "Ảnh nền" },
                content: {
                    type: "group",
                    label: "Nội dung",
                    fields: {
                        heading: { type: "text", label: "Tiêu đề", max: 60 },
                        text: { type: "textarea", label: "Nội dung", max: 300 },
                    },
                },
                button: {
                    type: "group",
                    label: "Nút bấm",
                    fields: {
                        text: { type: "text", label: "Text", max: 30, default: "Đăng ký ngay" },
                        link: { type: "text", label: "Link", note: "VD: /register" },
                        style: {
                            type: "select",
                            label: "Kiểu",
                            options: ["primary", "secondary", "outline"],
                            default: "primary",
                        },
                    },
                },
            },
        },

        // CASE 5: Rich text editor
        about: {
            label: "Giới thiệu chi tiết",
            fields: {
                content: {
                    type: "richtext",
                    label: "Nội dung",
                    note: "Hỗ trợ HTML, in đậm, danh sách...",
                    toolbar: ["bold", "italic", "link", "list"],
                },
            },
        },

        // CASE 6: Video + multiple images
        gallery: {
            label: "Thư viện",
            fields: {
                video: {
                    type: "video",
                    label: "Video giới thiệu",
                    note: "MP4, max 50MB hoặc YouTube URL",
                    accept: ["mp4", "youtube"],
                },
                images: {
                    type: "array",
                    label: "Ảnh sản phẩm",
                    min: 3,
                    max: 12,
                    schema: {
                        url: { type: "image", label: "Ảnh", note: "800x600, max 2MB" },
                        caption: { type: "text", label: "Chú thích", max: 100 },
                    },
                },
            },
        },

        // CASE 7: Conditional fields (field phụ thuộc)
        contact: {
            label: "Thông tin liên hệ",
            fields: {
                type: {
                    type: "select",
                    label: "Loại",
                    options: ["form", "info", "map"],
                    default: "form",
                },
                formId: {
                    type: "text",
                    label: "ID Form",
                    note: "Chỉ dùng khi chọn type = form",
                    showIf: { field: "type", value: "form" },
                },
                mapEmbed: {
                    type: "textarea",
                    label: "Mã nhúng bản đồ",
                    note: "Chỉ dùng khi chọn type = map",
                    showIf: { field: "type", value: "map" },
                },
                phone: {
                    type: "text",
                    label: "SĐT",
                    showIf: { field: "type", value: "info" },
                },
                email: {
                    type: "text",
                    label: "Email",
                    showIf: { field: "type", value: "info" },
                },
            },
        },

        // CASE 8: Sortable array with order
        testimonials: {
            label: "Đánh giá khách hàng",
            fields: {
                items: {
                    type: "array",
                    label: "Danh sách đánh giá",
                    sortable: true, // Cho phép kéo thả sắp xếp
                    min: 3,
                    max: 10,
                    schema: {
                        avatar: { type: "image", label: "Avatar", note: "Hình vuông 200x200" },
                        name: { type: "text", label: "Tên", required: true },
                        role: { type: "text", label: "Chức vụ/Công ty" },
                        rating: {
                            type: "number",
                            label: "Số sao",
                            min: 1,
                            max: 5,
                            default: 5,
                        },
                        comment: { type: "textarea", label: "Nội dung", max: 500 },
                    },
                },
            },
        },

        // CASE 9: Multi-language (nếu cần)
        footer: {
            label: "Footer",
            multilang: true, // Đánh dấu section hỗ trợ đa ngôn ngữ
            fields: {
                copyright: {
                    type: "text",
                    label: "Copyright",
                    langs: ["vi", "en"], // Tự động tạo 2 field: copyright_vi, copyright_en
                },
                links: {
                    type: "array",
                    label: "Links",
                    schema: {
                        text: { type: "text", label: "Text", langs: ["vi", "en"] },
                        url: { type: "text", label: "URL" },
                    },
                },
            },
        },

        // CASE 10: SEO metadata
        seo: {
            label: "SEO",
            collapsed: true, // Mặc định thu gọn
            fields: {
                title: { type: "text", label: "Meta Title", max: 60 },
                description: { type: "textarea", label: "Meta Description", max: 160 },
                keywords: { type: "text", label: "Keywords", note: "Ngăn cách bởi dấu phẩy" },
                ogImage: { type: "image", label: "OG Image", note: "1200x630 cho Facebook" },
                noindex: { type: "boolean", label: "No Index?", default: false },
            },
        },
    },
};
```

---

## 📘 HƯỚNG DẪN CONFIG CHI TIẾT

### **1. Cấu trúc cơ bản**

```typescript
{
  page: 'tên-page',           // ID duy nhất, dùng cho route
  path: 'pages/tên-page',     // Path trên Firestore
  sections: {
    sectionId: {
      label: 'Tên hiển thị',  // Hiện trên admin
      fields: { ... }
    }
  }
}
```

### **2. Các loại Field Type**

| Type       | Mô tả            | Props                              |
| ---------- | ---------------- | ---------------------------------- |
| `text`     | Input 1 dòng     | `max`, `required`, `default`       |
| `textarea` | Input nhiều dòng | `max`, `required`, `rows`          |
| `richtext` | Editor WYSIWYG   | `toolbar`, `max`                   |
| `image`    | Upload ảnh       | `note`, `maxSize`                  |
| `video`    | Upload video/URL | `accept`, `maxSize`                |
| `number`   | Input số         | `min`, `max`, `default`            |
| `boolean`  | Checkbox         | `default`                          |
| `select`   | Dropdown         | `options`, `default`               |
| `array`    | Danh sách items  | `min`, `max`, `schema`, `sortable` |
| `group`    | Nhóm fields      | `fields`                           |

---

## 📐 NGUYÊN TẮC CHỌN FIELD TYPE

### **Khi nào dùng `text` vs `textarea` vs `richtext`?**

| Field Type | Sử dụng khi                                 | Ví dụ                                 |
| ---------- | ------------------------------------------- | ------------------------------------- |
| `text`     | Nội dung ngắn, 1 dòng, < 100 ký tự          | Tiêu đề, tên, label, URL, icon name   |
| `textarea` | Nội dung thuần text nhiều dòng, < 500 ký tự | Mô tả ngắn, meta description, ghi chú |
| `richtext` | Nội dung dài, cần định dạng HTML            | Bài viết, giới thiệu, mô tả chi tiết  |

### **🎯 QUY TẮC BẮT BUỘC DÙNG `richtext`:**

> **Rule: Nếu nội dung cần FORMATTING (in đậm, danh sách, heading, link) → PHẢI dùng `richtext`**

✅ **DÙNG `richtext` cho:**

-   Nội dung giới thiệu công ty/dịch vụ/sản phẩm
-   Mô tả chi tiết (> 500 ký tự)
-   Bài viết blog/tin tức
-   Nội dung có cấu trúc (heading, bullet points)
-   Bất cứ field nào user có thể muốn định dạng

❌ **KHÔNG dùng `richtext` cho:**

-   Tiêu đề, tên (dùng `text`)
-   Mô tả ngắn SEO (dùng `textarea` với `max: 160`)
-   Giá trị đơn như số điện thoại, email, URL

### **Ví dụ áp dụng:**

```typescript
// ✅ ĐÚNG - Dùng richtext cho nội dung cần định dạng
content: {
    label: "Nội dung giới thiệu",
    fields: {
        title: { type: "text", label: "Tiêu đề", max: 80 },
        body: { type: "richtext", label: "Nội dung chi tiết", placeholder: "Nhập nội dung..." },
    }
}

// ❌ SAI - Dùng textarea cho nội dung dài cần định dạng
content: {
    label: "Nội dung giới thiệu",
    fields: {
        body: { type: "textarea", label: "Nội dung chi tiết", rows: 10 }, // SAI!
    }
}
```

### **Checklist khi tạo config mới:**

-   [ ] Trang có section giới thiệu dài? → Thêm field `richtext`
-   [ ] Trang có mô tả sản phẩm/dịch vụ chi tiết? → Thêm field `richtext`
-   [ ] Nội dung có thể cần bullet points, heading? → Thêm field `richtext`
-   [ ] User có thể muốn chèn link, in đậm? → Thêm field `richtext`

### **3. Props chung cho tất cả fields**

```typescript
{
  type: 'text',
  label: 'Nhãn hiển thị',    // Bắt buộc
  note: 'Ghi chú hướng dẫn', // Tùy chọn
  required: true,            // Bắt buộc nhập
  default: 'giá trị mặc định'
}
```

### **4. Props đặc biệt theo type**

**Text/Textarea:**

```typescript
{
  type: 'text',
  max: 100,        // Độ dài tối đa
  rows: 5          // Chỉ cho textarea
}
```

**Number:**

```typescript
{
  type: 'number',
  min: 0,
  max: 100,
  step: 1          // Bước nhảy
}
```

**Select:**

```typescript
{
  type: 'select',
  options: ['option1', 'option2'],
  // Hoặc
  options: [
    { value: 'val1', label: 'Label 1' },
    { value: 'val2', label: 'Label 2' }
  ]
}
```

**Image/Video:**

```typescript
{
  type: 'image',
  maxSize: 5,           // MB
  accept: ['jpg', 'png', 'webp'],
  note: 'Kích thước đề xuất'
}
```

**Array:**

```typescript
{
  type: 'array',
  min: 1,               // Số item tối thiểu
  max: 10,              // Số item tối đa
  sortable: true,       // Cho phép kéo thả
  schema: {             // Cấu trúc mỗi item
    field1: { ... },
    field2: { ... }
  }
}
```

**Group:**

```typescript
{
  type: 'group',
  fields: {
    field1: { ... },
    field2: { ... }
  }
}
```

### **5. CASES ĐẶC BIỆT**

#### **A. Conditional Fields (Hiện/ẩn theo điều kiện)**

```typescript
{
  mainField: {
    type: 'select',
    options: ['option1', 'option2']
  },
  dependentField: {
    type: 'text',
    showIf: {
      field: 'mainField',    // Field phụ thuộc
      value: 'option1'       // Giá trị để hiện
    }
  }
}
```

#### **B. Multi-language**

```typescript
{
  multilang: true,    // Đánh dấu section
  fields: {
    title: {
      type: 'text',
      langs: ['vi', 'en']  // Tạo title_vi, title_en
    }
  }
}
```

#### **C. Nested Array (Mảng lồng nhau)**

```typescript
{
  categories: {
    type: 'array',
    schema: {
      name: { type: 'text' },
      products: {         // Array trong array
        type: 'array',
        schema: {
          title: { type: 'text' },
          price: { type: 'number' }
        }
      }
    }
  }
}
```

#### **D. Validation phức tạp**

```typescript
{
  email: {
    type: 'text',
    validate: (value) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    errorMsg: 'Email không hợp lệ'
  }
}
```

#### **E. Dynamic options (Select từ API)**

```typescript
{
  category: {
    type: 'select',
    optionsFrom: 'api/categories',  // Fetch từ endpoint
    // Hoặc
    optionsFrom: async () => {
      return await fetchCategories();
    }
  }
}
```

#### **F. File constraints**

```typescript
{
  banner: {
    type: 'image',
    maxSize: 5,              // MB
    minWidth: 1920,          // px
    minHeight: 1080,
    aspectRatio: '16:9',     // Tỷ lệ bắt buộc
    accept: ['jpg', 'png']
  }
}
```

#### **G. Rich text với custom toolbar**

```typescript
{
  content: {
    type: 'richtext',
    toolbar: [
      'bold', 'italic', 'underline',
      'h1', 'h2', 'h3',
      'link', 'image',
      'bulletList', 'orderedList',
      'code', 'blockquote'
    ],
    max: 5000  // Ký tự
  }
}
```

#### **H. Collapsed section (Thu gọn mặc định)**

```typescript
{
  advancedSettings: {
    label: 'Cài đặt nâng cao',
    collapsed: true,    // Mặc định thu gọi
    fields: { ... }
  }
}
```

#### **I. Readonly/Disabled fields**

```typescript
{
  createdAt: {
    type: 'text',
    readonly: true,     // Chỉ xem, không sửa
    default: () => new Date().toISOString()
  }
}
```

#### **J. Custom render component**

```typescript
{
  colorPicker: {
    type: 'custom',
    component: 'ColorPicker',  // Component riêng
    props: {
      format: 'hex'
    }
  }
}
```

### **6. Firestore Structure tự động tạo**

Config này:

```typescript
{
  page: 'home',
  path: 'pages/home',
  sections: {
    hero: {
      fields: {
        title: { type: 'text' }
      }
    }
  }
}
```

Sẽ tạo trên Firestore:

```
pages/
  home/
    hero/
      title: "Giá trị"
```

### **7. Validation Rules**

```typescript
// Tự động validate dựa trên config
const validateField = (field, value) => {
    if (field.required && !value) return "Bắt buộc nhập";
    if (field.max && value.length > field.max) return `Tối đa ${field.max} ký tự`;
    if (field.min && value < field.min) return `Tối thiểu ${field.min}`;
    if (field.validate) return field.validate(value);
    return null;
};
```

### **8. Tips & Best Practices**

✅ **DO:**

-   Đặt tên field ngắn gọn, tiếng Anh
-   Dùng `note` để hướng dẫn rõ ràng
-   Giới hạn `min/max` hợp lý
-   Dùng `default` cho giá trị phổ biến

❌ **DON'T:**

-   Tạo quá nhiều nested array (>2 level)
-   Field name có dấu cách hoặc ký tự đặc biệt
-   Quên `required` cho field quan trọng
-   `max` quá lớn gây lag

```typescript
// ========================================
// 9. FILE page.config.ts TỔNG (ADMIN)
// ========================================

// src/admin/configs/page.config.ts
import { homeConfig } from "@/pages/home/home.config";
import { aboutConfig } from "@/pages/about/about.config";
import { productConfig } from "@/pages/product/product.config";
import { contactConfig } from "@/pages/contact/contact.config";
import { blogConfig } from "@/pages/blog/blog.config";

/**
 * REGISTRY TỔNG - Import tất cả page configs
 * File này là trung tâm quản lý, admin sẽ đọc từ đây
 */
export const PAGE_CONFIGS = {
    home: homeConfig,
    about: aboutConfig,
    product: productConfig,
    contact: contactConfig,
    blog: blogConfig,
    // Thêm page mới ở đây...
} as const;

// Type-safe page keys
export type PageKey = keyof typeof PAGE_CONFIGS;

// Helper để lấy config của 1 page
export const getPageConfig = (pageKey: PageKey) => {
    return PAGE_CONFIGS[pageKey];
};

// Helper để lấy tất cả pages (dùng cho sidebar)
export const getAllPages = () => {
    return Object.entries(PAGE_CONFIGS)
        .map(([key, config]) => ({
            key,
            name: config.pageName || key,
            path: `/admin/${key}`,
            icon: config.icon || "FileText",
            order: config.order || 999,
        }))
        .sort((a, b) => a.order - b.order);
};

// Helper để lấy Firestore path
export const getFirestorePath = (pageKey: PageKey, sectionId?: string) => {
    const config = PAGE_CONFIGS[pageKey];
    const basePath = config.path;
    return sectionId ? `${basePath}/${sectionId}` : basePath;
};

// Validate config khi khởi động app
export const validateConfigs = () => {
    const errors: string[] = [];

    Object.entries(PAGE_CONFIGS).forEach(([key, config]) => {
        if (!config.page) errors.push(`${key}: thiếu field "page"`);
        if (!config.path) errors.push(`${key}: thiếu field "path"`);
        if (!config.sections) errors.push(`${key}: thiếu field "sections"`);

        // Validate sections
        Object.entries(config.sections).forEach(([sectionId, section]) => {
            if (!section.label) {
                errors.push(`${key}.${sectionId}: thiếu "label"`);
            }
            if (!section.fields) {
                errors.push(`${key}.${sectionId}: thiếu "fields"`);
            }
        });
    });

    if (errors.length > 0) {
        console.error("❌ Config validation failed:", errors);
        throw new Error(`Config có ${errors.length} lỗi`);
    }

    console.log("✅ All page configs validated successfully");
};
```

---

```typescript
// ========================================
// 10. CẤU TRÚC THƯ MỤC PROJECT
// ========================================

/**
 * src/
 * ├── admin/                        # Admin dashboard
 * │   ├── configs/
 * │   │   └── page.config.ts        # ⭐ FILE TỔNG - Import tất cả configs
 * │   ├── components/
 * │   │   ├── FormGenerator.vue     # Generate form từ config
 * │   │   ├── FieldRenderer.vue     # Render từng field type
 * │   │   └── Sidebar.vue           # Sidebar động
 * │   ├── pages/
 * │   │   ├── AdminLayout.vue
 * │   │   └── PageEditor.vue        # Editor cho mỗi page
 * │   └── utils/
 * │       ├── formBuilder.ts        # Logic build form
 * │       └── firebaseSync.ts       # Sync với Firestore
 * │
 * ├── pages/                        # Frontend pages
 * │   ├── home/
 * │   │   ├── HomePage.vue
 * │   │   └── home.config.ts        # ⭐ Config riêng của home
 * │   ├── about/
 * │   │   ├── AboutPage.vue
 * │   │   └── about.config.ts       # ⭐ Config riêng của about
 * │   ├── product/
 * │   │   ├── ProductPage.vue
 * │   │   └── product.config.ts     # ⭐ Config riêng của product
 * │   └── contact/
 * │       ├── ContactPage.vue
 * │       └── contact.config.ts     # ⭐ Config riêng của contact
 * │
 * ├── composables/
 * │   └── usePageData.ts            # Composable load/save data
 * │
 * └── types/
 *     └── page-config.d.ts          # TypeScript definitions
 */
```

---

```typescript
// ========================================
// 11. VÍ DỤ CONFIG CỤ THỂ TỪNG PAGE
// ========================================

// src/pages/home/home.config.ts
export const homeConfig = {
    page: "home",
    pageName: "Trang chủ",
    path: "pages/home",
    icon: "Home", // Icon cho sidebar
    order: 1, // Thứ tự hiển thị

    sections: {
        hero: {
            label: "Banner chính",
            collapsed: false, // Mặc định mở
            fields: {
                bg: {
                    type: "image",
                    label: "Ảnh nền",
                    note: "1920x1080, max 5MB",
                    required: true,
                },
                title: {
                    type: "text",
                    label: "Tiêu đề",
                    max: 80,
                    required: true,
                },
                subtitle: {
                    type: "textarea",
                    label: "Mô tả",
                    max: 200,
                },
            },
        },

        features: {
            label: "Tính năng nổi bật",
            fields: {
                items: {
                    type: "array",
                    label: "Danh sách tính năng",
                    min: 3,
                    max: 6,
                    sortable: true,
                    schema: {
                        icon: { type: "image", label: "Icon", note: "SVG 64x64" },
                        title: { type: "text", label: "Tiêu đề", max: 50 },
                        desc: { type: "textarea", label: "Mô tả", max: 150 },
                    },
                },
            },
        },
    },
};
```

```typescript
// src/pages/about/about.config.ts
export const aboutConfig = {
    page: "about",
    pageName: "Giới thiệu",
    path: "pages/about",
    icon: "Info",
    order: 2,

    sections: {
        intro: {
            label: "Giới thiệu công ty",
            fields: {
                content: {
                    type: "richtext",
                    label: "Nội dung",
                    toolbar: ["bold", "italic", "link", "h2", "h3", "bulletList"],
                },
            },
        },

        team: {
            label: "Đội ngũ",
            fields: {
                members: {
                    type: "array",
                    label: "Thành viên",
                    min: 1,
                    max: 20,
                    sortable: true,
                    schema: {
                        avatar: { type: "image", label: "Ảnh", note: "400x400" },
                        name: { type: "text", label: "Họ tên", required: true },
                        position: { type: "text", label: "Chức vụ" },
                        bio: { type: "textarea", label: "Giới thiệu", max: 300 },
                    },
                },
            },
        },
    },
};
```

```typescript
// src/pages/product/product.config.ts
export const productConfig = {
    page: "product",
    pageName: "Sản phẩm",
    path: "pages/product",
    icon: "Package",
    order: 3,

    sections: {
        hero: {
            label: "Banner sản phẩm",
            fields: {
                bg: { type: "image", label: "Ảnh nền", note: "1920x1080" },
                logo: { type: "image", label: "Logo sản phẩm", note: "PNG transparent" },
                title: { type: "text", label: "Tên sản phẩm", required: true },
                tagline: { type: "text", label: "Slogan", max: 100 },
            },
        },

        pricing: {
            label: "Bảng giá",
            fields: {
                plans: {
                    type: "array",
                    label: "Các gói",
                    min: 2,
                    max: 4,
                    sortable: true,
                    schema: {
                        name: { type: "text", label: "Tên gói", required: true },
                        price: { type: "text", label: "Giá", note: "VD: 199.000đ/tháng" },
                        highlight: { type: "boolean", label: "Gói nổi bật?", default: false },
                        features: {
                            type: "array",
                            label: "Tính năng",
                            min: 1,
                            max: 15,
                            schema: {
                                text: { type: "text", label: "Nội dung", max: 100 },
                                available: { type: "boolean", label: "Có tính năng?", default: true },
                            },
                        },
                    },
                },
            },
        },

        gallery: {
            label: "Thư viện",
            fields: {
                video: {
                    type: "video",
                    label: "Video demo",
                    note: "MP4 max 50MB hoặc YouTube URL",
                    accept: ["mp4", "youtube"],
                },
                images: {
                    type: "array",
                    label: "Ảnh sản phẩm",
                    min: 3,
                    max: 12,
                    schema: {
                        url: { type: "image", label: "Ảnh", note: "800x600" },
                        caption: { type: "text", label: "Chú thích", max: 100 },
                    },
                },
            },
        },
    },
};
```

---

```typescript
// ========================================
// 12. HƯỚNG DẪN SỬ DỤNG CONFIG
// ========================================

/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  PHẦN A: TẠO VÀ QUẢN LÝ CONFIG                              │
 * └─────────────────────────────────────────────────────────────┘
 */

// 1. Tạo config mới cho page
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// File: src/pages/services/services.config.ts

export const servicesConfig = {
  page: 'services',              // ID page (dùng cho routing, firestore path)
  pageName: 'Dịch vụ',          // Tên hiển thị trên admin sidebar
  path: 'pages/services',        // Đường dẫn Firestore (collection/document)
  icon: 'Briefcase',            // Icon hiển thị sidebar (từ lucide-icons)
  order: 4,                     // Thứ tự hiển thị trên sidebar (càng nhỏ càng ưu tiên)

  sections: {
    // Mỗi section = 1 document trên Firestore
    intro: { ... },
    list: { ... }
  }
};

// 2. Import vào file tổng
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// File: src/admin/configs/page.config.ts

import { servicesConfig } from '@/pages/services/services.config';

export const PAGE_CONFIGS = {
  home: homeConfig,
  about: aboutConfig,
  services: servicesConfig,  // ⭐ Thêm dòng này
  // ...
};

// ✅ XONG! Sidebar admin tự động có mục "Dịch vụ"
// ✅ Route /admin/services tự động hoạt động
// ✅ Firestore sẽ tạo: pages/services/intro, pages/services/list


/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  PHẦN B: CẤU TRÚC FIRESTORE TỰ ĐỘNG                         │
 * └─────────────────────────────────────────────────────────────┘
 */

// Config này:
{
  page: 'home',
  path: 'pages/home',
  sections: {
    hero: { fields: { title: {...}, subtitle: {...} } },
    features: { fields: { items: {...} } }
  }
}

// Sẽ tạo Firestore structure:
/*
  pages (collection)
  └── home (document)
      ├── hero (document)
      │   ├── title: "Welcome"
      │   └── subtitle: "To our website"
      └── features (document)
          └── items: [
              { icon: "...", title: "Fast" },
              { icon: "...", title: "Secure" }
            ]
*/

// Quy tắc:
// - path = Firestore collection path
// - section ID = document ID trong collection đó
// - fields = các field trong document


/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  PHẦN C: WORKFLOW THÊM PAGE MỚI                             │
 * └─────────────────────────────────────────────────────────────┘
 */

// BƯỚC 1: Tạo file config
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Tạo: src/pages/blog/blog.config.ts
// Copy template từ home.config.ts và chỉnh sửa

// BƯỚC 2: Import vào page.config.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Mở: src/admin/configs/page.config.ts
// Thêm: import { blogConfig } from '@/pages/blog/blog.config';
// Thêm: blog: blogConfig vào PAGE_CONFIGS

// BƯỚC 3: Tạo component frontend (nếu cần)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Tạo: src/pages/blog/BlogPage.vue
// Sử dụng composable usePageData để load data từ Firestore

// BƯỚC 4: Thêm route (nếu cần)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Frontend: { path: '/blog', component: BlogPage }
// Admin: { path: '/admin/blog', component: PageEditor }

// ✅ HOÀN THÀNH!
// - Admin sidebar có "Blog"
// - Form CRUD tự động sinh ra
// - Firestore path: pages/blog/...
// - Frontend load data tự động


/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  PHẦN D: WORKFLOW THÊM SECTION MỚI                          │
 * └─────────────────────────────────────────────────────────────┘
 */

// VÍ DỤ: Thêm section "testimonials" vào trang home

// BƯỚC 1: Mở file config
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Mở: src/pages/home/home.config.ts

// BƯỚC 2: Thêm section vào sections
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const homeConfig = {
  // ... existing config
  sections: {
    hero: { ... },
    features: { ... },

    // ⭐ Thêm section mới
    testimonials: {
      label: 'Đánh giá khách hàng',
      fields: {
        items: {
          type: 'array',
          label: 'Danh sách đánh giá',
          min: 3,
          max: 10,
          sortable: true,
          schema: {
            avatar: { type: 'image', label: 'Avatar', note: '200x200' },
            name: { type: 'text', label: 'Tên khách hàng', required: true },
            company: { type: 'text', label: 'Công ty' },
            rating: { type: 'number', label: 'Số sao', min: 1, max: 5 },
            comment: { type: 'textarea', label: 'Nhận xét', max: 500 }
          }
        }
      }
    }
  }
};

// ✅ XONG! Admin tự động có form để thêm/sửa testimonials
// ✅ Firestore tự động tạo: pages/home/testimonials
// ✅ Frontend chỉ cần load và hiển thị


/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  PHẦN E: WORKFLOW THÊM/SỬA FIELD                            │
 * └─────────────────────────────────────────────────────────────┘
 */

// VÍ DỤ: Thêm field "videoUrl" vào section hero

// BƯỚC 1: Mở config section
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
sections: {
  hero: {
    label: 'Banner chính',
    fields: {
      bg: { ... },
      title: { ... },
      subtitle: { ... },

      // ⭐ Thêm field mới
      videoUrl: {
        type: 'text',
        label: 'Link video YouTube',
        note: 'VD: https://youtube.com/watch?v=...',
        validate: (value) => {
          if (value && !value.includes('youtube.com')) {
            return 'Chỉ chấp nhận link YouTube';
          }
          return null;
        }
      }
    }
  }
}

// ✅ XONG! Form admin tự động có input "Link video YouTube"
// ✅ Validation tự động chạy
// ✅ Data lưu vào Firestore: pages/home/hero/videoUrl


/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  PHẦN F: LOAD VÀ SAVE DATA TRONG ADMIN                     │
 * └─────────────────────────────────────────────────────────────┘
 */

// Admin component tự động:
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 1. Đọc config từ PAGE_CONFIGS
const config = getPageConfig('home');

// 2. Loop qua từng section
Object.entries(config.sections).forEach(([sectionId, section]) => {
  // 3. Load data từ Firestore
  const docRef = doc(db, config.path, sectionId);
  const data = await getDoc(docRef);

  // 4. Render form dựa trên section.fields
  // FormGenerator tự động tạo input tương ứng với field type

  // 5. Khi user save, ghi vào Firestore
  await setDoc(docRef, formData, { merge: true });
});


/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  PHẦN G: LOAD DATA TRONG FRONTEND                           │
 * └─────────────────────────────────────────────────────────────┘
 */

// Cách 1: Manual load
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const heroData = ref({});

onMounted(async () => {
  const docRef = doc(db, 'pages/home/hero');
  const docSnap = await getDoc(docRef);
  heroData.value = docSnap.data();
});

// Cách 2: Dùng composable (khuyến nghị)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const { data: heroData, load } = usePageData('home', 'hero');
await load();

// Cách 3: Dùng helper function
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const path = getFirestorePath('home', 'hero');
// Returns: "pages/home/hero"


/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  PHẦN H: XỬ LÝ CÁC CASE ĐỘC BIỆT                           │
 * └─────────────────────────────────────────────────────────────┘
 */

// Case 1: Multi-language
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  footer: {
    label: 'Footer',
    multilang: true,
    fields: {
      copyright: {
        type: 'text',
        langs: ['vi', 'en']  // Tự động tạo copyright_vi, copyright_en
      }
    }
  }
}
// Firestore: pages/home/footer/copyright_vi, copyright_en

// Case 2: Conditional fields
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  contact: {
    fields: {
      type: {
        type: 'select',
        options: ['form', 'map', 'info']
      },
      mapEmbed: {
        type: 'textarea',
        showIf: { field: 'type', value: 'map' }  // Chỉ hiện khi chọn 'map'
      }
    }
  }
}

// Case 3: Computed fields
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  order: {
    fields: {
      quantity: { type: 'number' },
      unitPrice: { type: 'number' },
      total: {
        type: 'number',
        computed: true,
        readonly: true,
        calculate: (data) => data.quantity * data.unitPrice
      }
    }
  }
}

// Case 4: Dynamic schema
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  eventForm: {
    fields: {
      eventId: { type: 'select', optionsFrom: 'api/events' },
      customFields: {
        type: 'dynamic-schema',
        schemaFrom: async (formData) => {
          const event = await fetchEvent(formData.eventId);
          return event.formSchema;  // Schema thay đổi theo event
        }
      }
    }
  }
}

// Case 5: Permission-based
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  product: {
    fields: {
      name: { type: 'text' },
      featured: {
        type: 'boolean',
        permission: 'admin'  // Chỉ admin mới thấy field này
      },
      cost: {
        type: 'number',
        showIf: (user) => user.role === 'admin'  // Logic phức tạp hơn
      }
    }
  }
}


/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  PHẦN I: VALIDATION TỰ ĐỘNG                                 │
 * └─────────────────────────────────────────────────────────────┘
 */

// Validation level 1: Field-level (tự động)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  title: {
    type: 'text',
    required: true,      // ✅ Tự động check required
    max: 100             // ✅ Tự động check length
  }
}

// Validation level 2: Custom field validation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  email: {
    type: 'text',
    validate: (value) => {
      if (!value.includes('@')) return 'Email không hợp lệ';
      return null;  // null = pass
    }
  }
}

// Validation level 3: Section-level (cross-field)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  event: {
    fields: {
      startDate: { type: 'date' },
      endDate: { type: 'date' }
    },
    validate: (data) => {
      if (data.endDate <= data.startDate) {
        return { endDate: 'Phải sau ngày bắt đầu' };
      }
      return null;
    }
  }
}


/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  PHẦN J: BEST PRACTICES                                     │
 * └─────────────────────────────────────────────────────────────┘
 */

// ✅ DO:
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. Đặt tên field bằng tiếng Anh, camelCase
// 2. Dùng note để hướng dẫn rõ ràng cho admin
// 3. Đặt giá trị default hợp lý
// 4. Giới hạn min/max cho array và text
// 5. Group các field liên quan bằng type: 'group'
// 6. Dùng sortable: true cho array cần sắp xếp
// 7. Validate ngay tại config, không để đến runtime
// 8. Đặt order để sắp xếp menu sidebar hợp lý
// 9. Test config bằng validateConfigs() khi start app
// 10. Document các field phức tạp trong note

// ❌ DON'T:
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. Tạo nested array quá sâu (>2 levels)
// 2. Field name có dấu cách hoặc ký tự đặc biệt
// 3. max quá lớn (>10000 ký tự) gây lag
// 4. Quên required cho field quan trọng
// 5. Không đặt note cho field phức tạp
// 6. Array không có min/max (có thể thêm vô hạn)
// 7. Image không giới hạn maxSize (upload ảnh quá lớn)
// 8. Duplicate field names trong cùng 1 section
// 9. Path Firestore có ký tự đặc biệt (/, \, space)
// 10. Thay đổi cấu trúc config mà không migrate data cũ


/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  PHẦN K: TROUBLESHOOTING                                    │
 * └─────────────────────────────────────────────────────────────┘
 */

// Problem 1: Sidebar không hiện page mới
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Solution:
// - Check đã import vào page.config.ts chưa?
// - Check config có đủ page, pageName, path không?
// - Reload lại app (clear cache nếu cần)

// Problem 2: Form không hiển thị field
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Solution:
// - Check showIf condition có đúng không?
// - Check field type có được FieldRenderer hỗ trợ không?
// - Check console có lỗi validation không?

// Problem 3: Data không lưu vào Firestore
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Solution:
// - Check Firestore path đúng format chưa?
// - Check permissions trên Firestore rules
// - Check validation có pass không?
// - Log formData trước khi save

// Problem 4: Array items không sortable
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Solution:
// - Thêm sortable: true vào config array
// - Check component ArrayEditor có implement drag-drop chưa?

// Problem 5: Computed field không tự động update
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Solution:
// - Check calculate function có dependency fields đúng không?
// - Dùng watch() hoặc computed() trong component
// - Re-calculate khi dependency fields thay đổi


/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  PHẦN L: MIGRATION VÀ VERSION CONTROL                       │
 * └─────────────────────────────────────────────────────────────┘
 */

// Khi thay đổi config structure:
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 1. Version config
export const homeConfig = {
  version: '2.0',  // ⭐ Thêm version
  // ...
};

// 2. Tạo migration script
// scripts/migrate-config-v2.ts
const migrateHomeConfig = async () => {
  // Read old data
  const oldData = await getDoc(doc(db, 'pages/home/hero'));

  // Transform to new structure
  const newData = {
    // Old: { title, subtitle }
    // New: { heading: { main, sub } }
    heading: {
      main: oldData.title,
      sub: oldData.subtitle
    }
  };

  // Save new data
  await setDoc(doc(db, 'pages/home/hero'), newData);
};

// 3. Backup trước khi migrate
// Firestore Console → Export data

// 4. Test migration trên staging trước

// 5. Deploy lên production


/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  PHẦN M: PERFORMANCE OPTIMIZATION                           │
 * └─────────────────────────────────────────────────────────────┘
 */

// Tip 1: Lazy load sections
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Chỉ load section đang edit, không load hết tất cả sections

// Tip 2: Cache config
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Config ít thay đổi → cache trong memory

// Tip 3: Debounce save
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Không save mỗi lần user type, debounce 500ms

// Tip 4: Optimize image upload
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Compress image trước khi upload lên Firebase Storage

// Tip 5: Pagination cho array lớn
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Array >100 items → implement pagination trong admin


/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  PHẦN N: SECURITY CONSIDERATIONS                            │
 * └─────────────────────────────────────────────────────────────┘
 */

// 1. Firestore Rules
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read
    match /pages/{page}/{section} {
      allow read: if true;
      allow write: if request.auth != null &&
                     request.auth.token.admin == true;
    }
  }
}

// 2. Validate trên server
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Không chỉ validate client-side, validate cả server-side

// 3. Sanitize HTML input
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Rich text → dùng DOMPurify để sanitize trước khi lưu

// 4. Rate limiting
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Giới hạn số lần save trong 1 phút

// 5. Audit log
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Log mọi thay đổi: who, when, what, before, after
```

---

## 📚 **TÓM TẮT WORKFLOW**

### **Thêm Page Mới:**

1. Tạo `pages/[name]/[name].config.ts`
2. Import vào `admin/configs/page.config.ts`
3. Tạo `pages/[name]/[Name]Page.vue`
4. Thêm routes

### **Thêm Section:**

1. Mở file config của page
2. Thêm vào `sections: { newSection: {...} }`

### **Thêm Field:**

1. Mở config của section
2. Thêm vào `fields: { newField: {...} }`

### **Load Data Frontend:**

```javascript
// Dùng composable
const { data, load } = usePageData("home", "hero");
await load();
```

### **Ưu Điểm:**

✅ Zero-code admin (config-driven)  
✅ Type-safe TypeScript  
✅ Auto validation  
✅ Auto Firestore sync  
✅ Dễ maintain & scale  
✅ Reusable components

---

## 🔥 NGUYÊN TẮC METADATA-DRIVEN UI

> **Core Principle: "Change Metadata, Not Code"**
>
> Khi sửa bất kỳ config nào, Admin UI TỰ ĐỘNG thay đổi theo mà KHÔNG cần sửa code admin.

### 📌 Nguyên Tắc 1: Single Source of Truth

```typescript
// Config metadata là nguồn DUY NHẤT định nghĩa UI
// Admin KHÔNG hard-code bất kỳ field nào

// ❌ SAI - Hard-code trong Admin
<input v-if="fieldName === 'title'" type="text" />
<input v-if="fieldName === 'email'" type="email" />

// ✅ ĐÚNG - Render từ metadata
<component :is="FIELD_COMPONENTS[field.type]" v-bind="field" />
```

### 📌 Nguyên Tắc 2: Field Type Registry

```typescript
// Mọi field type được map tự động sang component

const FIELD_TYPE_MAP = {
    text: "TextInput",
    textarea: "TextareaInput",
    number: "NumberInput",
    boolean: "BooleanCheckbox",
    select: "SelectDropdown",
    image: "ImageUploader",
    video: "VideoUploader",
    richtext: "RichTextEditor", // ← TipTap
    array: "ArrayEditor",
    group: "FieldGroup",
    date: "DatePicker",
    color: "ColorPicker",
};

// Thêm field type mới chỉ 3 bước:
// 1. Tạo component: admin/components/fields/NewType.vue
// 2. Register vào FIELD_TYPE_MAP
// 3. Dùng ngay: type: 'new-type'
```

### 📌 Nguyên Tắc 3: Sidebar Order & Grouping

```typescript
// Thay đổi thứ tự sidebar = sửa field "order"

// home.config.ts
export const homeConfig = {
    page: "home",
    pageName: "Trang chủ",
    icon: "mdi:home",
    order: 1, // ← Xuất hiện đầu tiên
    group: "Trang", // ← Nhóm trên sidebar
    // ...
};

// about.config.ts
export const aboutConfig = {
    order: 2, // ← Xuất hiện thứ 2
    group: "Trang",
};

// openGraph.config.ts
export const openGraphConfig = {
    order: 100, // ← Số lớn = xuất hiện cuối
    group: "Cài đặt", // ← Nhóm khác trên sidebar
};

// Sidebar tự động hiển thị:
// ┌─────────────────┐
// │ Trang           │
// │  ├─ Trang chủ   │
// │  └─ Giới thiệu  │
// │ Cài đặt         │
// │  └─ Open Graph  │
// └─────────────────┘
```

### 📌 Nguyên Tắc 4: Auto Form Generation

```typescript
// Sửa config → Form tự động thay đổi

// TRƯỚC: Text input
fields: {
    description: {
        type: 'text',
        label: 'Mô tả'
    }
}

// SAU: Textarea (chỉ sửa type)
fields: {
    description: {
        type: 'textarea',  // ← Đổi dòng này
        label: 'Mô tả',
        rows: 5
    }
}

// Refresh browser → Form tự động đổi từ <input> sang <textarea>
```

### 📌 Nguyên Tắc 5: Rich Text Editor (TipTap)

```typescript
// Thêm TipTap editor = chỉ cần khai báo type: 'richtext'

fields: {
    content: {
        type: 'richtext',
        label: 'Nội dung',
        toolbar: ['bold', 'italic', 'link', 'h2', 'h3', 'bulletList', 'image'],
        max: 10000,
        note: 'Hỗ trợ HTML formatting'
    }
}

// Admin tự động render TipTap với toolbar được chỉ định
```

### 📌 Nguyên Tắc 6: Conditional Fields

```typescript
// Field tự động ẩn/hiện dựa trên showIf

fields: {
    enableFeature: {
        type: 'boolean',
        label: 'Bật tính năng?',
        default: false
    },
    featureConfig: {
        type: 'text',
        label: 'Cấu hình',
        showIf: { field: 'enableFeature', value: true }
        // ↑ Tự động ẩn/hiện khi toggle checkbox
    }
}
```

---

## 🛠️ WORKFLOW THÊM PAGE MỚI (METADATA-DRIVEN)

### Bước 1: Tạo Config

```typescript
// pages/contact/contact.config.ts
export const contactConfig = {
    page: "contact",
    pageName: "Liên hệ",
    path: "pages/contact",
    icon: "mdi:phone",
    order: 5,
    group: "Trang",
    sections: {
        info: {
            label: "Thông tin liên hệ",
            fields: {
                phone: { type: "text", label: "Số điện thoại" },
                email: { type: "text", label: "Email" },
                address: { type: "richtext", label: "Địa chỉ" },
            },
        },
    },
};
```

### Bước 2: Import vào Registry

```typescript
// admin/page.config.ts
import { contactConfig } from "@/pages/contact/contact.config";

export const PAGE_CONFIGS = {
    // ...existing
    contact: contactConfig, // ← Thêm dòng này
};
```

### Bước 3: Done!

```
✅ Sidebar tự động có "Liên hệ" (sorted by order)
✅ Click vào → Form có 3 fields: phone, email, address
✅ Address tự động là TipTap editor
✅ Validation tự động với required
✅ Data sync với Firestore path 'pages/contact'
```

---

## 🔄 EXAMPLE: THAY ĐỔI METADATA → UI TỰ ĐỘNG CẬP NHẬT

### Ví dụ 1: Đổi Text → Image

```typescript
// BEFORE
logo: { type: 'text', label: 'URL Logo' }

// AFTER (chỉ sửa type)
logo: { type: 'image', label: 'Logo', note: '200x200px' }

// → Admin tự động đổi từ text input sang Image Uploader
```

### Ví dụ 2: Thêm Validation

```typescript
// BEFORE
email: { type: 'text', label: 'Email' }

// AFTER (thêm required)
email: {
    type: 'text',
    label: 'Email',
    required: true  // ← Admin tự động hiện * và validate
}
```

### Ví dụ 3: Thêm Array với TipTap

```typescript
// Thêm vào bất kỳ config
faqs: {
    type: 'array',
    label: 'Câu hỏi thường gặp',
    min: 1,
    max: 20,
    sortable: true,
    schema: {
        question: { type: 'text', label: 'Câu hỏi', required: true },
        answer: {
            type: 'richtext',  // ← TipTap trong array!
            label: 'Câu trả lời',
            toolbar: ['bold', 'italic', 'link']
        }
    }
}

// → Admin tự động tạo list editor với drag-drop và TipTap cho mỗi item
```

---

## ✅ KẾT LUẬN

**100% Metadata-Driven Admin:**

| Thay đổi               | Cách làm                 | Code Admin cần sửa |
| ---------------------- | ------------------------ | ------------------ |
| Đổi thứ tự sidebar     | Sửa `order` trong config | ❌ Không           |
| Thêm page mới          | Import vào PAGE_CONFIGS  | ❌ Không           |
| Đổi field type         | Sửa `type` trong config  | ❌ Không           |
| Thêm TipTap editor     | `type: 'richtext'`       | ❌ Không           |
| Thêm validation        | `required: true`         | ❌ Không           |
| Thêm conditional field | `showIf: {...}`          | ❌ Không           |
| Thêm array editor      | `type: 'array'`          | ❌ Không           |

**→ KHÔNG BAO GIỜ phải sửa code trong thư mục admin/ khi thay đổi metadata config!**
