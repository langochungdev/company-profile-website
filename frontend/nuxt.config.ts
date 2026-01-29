// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: false },
    modules: ["@nuxtjs/tailwindcss", "@nuxt/icon"],
    plugins: ["~/admin/plugins/firebase.client.ts"],
    css: ["~/admin/styles/reset.css"],

    routeRules: {
        "/admin/**": {
            ssr: false,
            headers: {
                "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
            },
        },
    },

    runtimeConfig: {
        cloudinaryApiKey: "",
        cloudinaryApiSecret: "",
        firebaseServiceAccount: "",
        algoliaAppId: "",
        algoliaAdminKey: "",
        public: {
            algoliaSearchKey: "",
            siteName: "",
            siteUrl: "",
            envIsProd: false,

            cloudinaryCloudName: "",
            cloudinaryUploadPreset: "",
            firebaseApiKey: "",
            firebaseAuthDomain: "",
            firebaseProjectId: "",
            firebaseStorageBucket: "",
            firebaseMessagingSenderId: "",
            firebaseAppId: "",
            firebaseMeasurementId: "",
        },
    },

    app: {
        head: {
            title: "SHT Security - Giải pháp An ninh Thông minh",
            titleTemplate: "%s | SHT Security",
            meta: [
                { name: "description", content: "Cung cấp giải pháp an ninh thông minh, camera AI, hệ thống mạng, báo cháy cho doanh nghiệp" },
                { name: "keywords", content: "camera AI, an ninh thông minh, hệ thống mạng, báo cháy, kiểm soát ra vào" },
                { name: "theme-color", content: "#000000" },
                { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
                { name: "mobile-web-app-capable", content: "yes" },

                { property: "og:site_name", content: "SHT Security" },
                { property: "og:type", content: "website" },
                { property: "og:locale", content: "vi_VN" },

                { name: "twitter:card", content: "summary_large_image" },
                { name: "twitter:site", content: "@shtsecurity" },
            ],
            link: [
                { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
                { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
                { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
                { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
                { rel: "preconnect", href: "https://fonts.googleapis.com" },
                { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
                { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap" },
            ],
        },
    },
});
