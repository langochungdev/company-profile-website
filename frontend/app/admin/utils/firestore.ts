// Utility để tạo Firestore path dựa trên environment

export function getFirestorePath(configPath: string): string {
    const config = useRuntimeConfig();
    const publicConfig = config.public as Record<string, unknown>;
    const siteName = (publicConfig.siteName as string) || "default";
    const isProd = publicConfig.envIsProd === true || publicConfig.envIsProd === "true";
    const env = isProd ? "product" : "develop";

    return `${siteName}/${env}/${configPath}`;
}

export function getFirestoreInfo() {
    const config = useRuntimeConfig();
    const publicConfig = config.public as Record<string, unknown>;
    const isProd = publicConfig.envIsProd === true || publicConfig.envIsProd === "true";

    return {
        siteName: (publicConfig.siteName as string) || "default",
        environment: isProd ? "product" : "develop",
        isDevelopment: !isProd,
        isProduction: isProd,
    };
}
