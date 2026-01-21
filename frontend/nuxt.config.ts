// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    modules: ["@nuxtjs/tailwindcss", "@nuxt/icon"],
    plugins: ["~/admin/plugins/firebase.client.ts"],
    css: ["~/assets/css/reset.css"],

    runtimeConfig: {
        cloudinaryApiKey: "",
        cloudinaryApiSecret: "",
        firebaseServiceAccount: "",
        public: {
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
            title: "Toptech - IT Solution Agency",
            meta: [
                { name: "description", content: "IT Solution Agency providing innovative business solutions" },
                { name: "theme-color", content: "#000000" },
                { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
                { name: "mobile-web-app-capable", content: "yes" },
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
