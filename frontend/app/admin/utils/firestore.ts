export function getFirestorePath(configPath: string): string {
    const config = useRuntimeConfig();
    const siteName = config.public.siteName || "default";
    const env = config.public.nodeEnv || "development";

    return `${siteName}/${env}/${configPath}`;
}

export function getFirestoreInfo() {
    const config = useRuntimeConfig();
    return {
        siteName: config.public.siteName || "default",
        environment: config.public.nodeEnv || "development",
        isDevelopment: config.public.nodeEnv === "development",
        isProduction: config.public.nodeEnv === "production",
    };
}
