export const demoConfig = {
    page: "demo",
    pageName: "Demo Page",
    path: "dev/demo",
    icon: "mdi:test-tube",
    order: 99,
    group: "Dev Tools",

    sections: {
        hero: {
            label: "Hero Section",
            collapsed: false,
            visible: true,
            fields: {
                title: {
                    type: "text",
                    label: "Title",
                    max: 100,
                    default: "Welcome to Demo Page",
                    required: true,
                },
                subtitle: {
                    type: "text",
                    label: "Subtitle",
                    max: 200,
                    default: "Test your config and CRUD operations here",
                },
                heroImage: {
                    type: "image",
                    label: "Hero Image",
                    note: "1920x1080 recommended",
                },
            },
        },

        features: {
            label: "Features Section",
            collapsed: true,
            visible: true,
            fields: {
                sectionTitle: {
                    type: "text",
                    label: "Section Title",
                    default: "Key Features",
                    max: 50,
                },
                items: {
                    type: "array",
                    label: "Feature Items",
                    exact: 3,
                    sortable: true,
                    schema: {
                        icon: {
                            type: "text",
                            label: "Icon (MDI)",
                            default: "mdi:star",
                            note: "Example: mdi:check-circle",
                        },
                        title: {
                            type: "text",
                            label: "Feature Title",
                            max: 50,
                            required: true,
                        },
                        description: {
                            type: "textarea",
                            label: "Description",
                            max: 200,
                            rows: 3,
                        },
                    },
                },
            },
        },

        settings: {
            label: "Settings",
            collapsed: true,
            visible: true,
            fields: {
                showHero: {
                    type: "boolean",
                    label: "Show Hero Section",
                    default: true,
                },
                showFeatures: {
                    type: "boolean",
                    label: "Show Features Section",
                    default: true,
                },
                theme: {
                    type: "select",
                    label: "Theme Color",
                    options: ["blue", "green", "purple", "orange"],
                    default: "blue",
                },
                maxItems: {
                    type: "number",
                    label: "Max Items to Display",
                    min: 1,
                    max: 10,
                    default: 3,
                },
            },
        },
    },
};

export type DemoConfig = typeof demoConfig;
