// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    modules: ["@nuxtjs/tailwindcss", "@nuxt/icon"],
    css: ["~/assets/css/main.css"],
    app: {
        head: {
            title: "Toptech - IT Solution Agency",
            meta: [{ name: "description", content: "IT Solution Agency providing innovative business solutions" }],
            link: [
                { rel: "preconnect", href: "https://fonts.googleapis.com" },
                { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
                { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap" },
            ],
        },
    },
});
