// Service quản lý config (categories, tags) cho collections

import { doc, getDoc, setDoc, type Firestore } from "firebase/firestore";

export interface ConfigItem {
    id: string;
    name: string;
}

export interface CollectionConfig {
    categories: ConfigItem[];
    tags: ConfigItem[];
}

const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export const ConfigService = {
    async getConfig(db: Firestore, collectionPath: string): Promise<CollectionConfig> {
        const configPath = collectionPath.replace(/\/items$/, "/config");
        const docRef = doc(db, configPath);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                categories: data.categories || [],
                tags: data.tags || [],
            };
        }

        return { categories: [], tags: [] };
    },

    async saveConfig(db: Firestore, collectionPath: string, data: CollectionConfig): Promise<void> {
        const configPath = collectionPath.replace(/\/items$/, "/config");
        const docRef = doc(db, configPath);
        await setDoc(docRef, data);
    },

    async addCategory(db: Firestore, collectionPath: string, name: string): Promise<string> {
        const config = await this.getConfig(db, collectionPath);
        const id = generateId();
        config.categories.push({ id, name });
        await this.saveConfig(db, collectionPath, config);
        return id;
    },

    async updateCategory(db: Firestore, collectionPath: string, id: string, name: string): Promise<void> {
        const config = await this.getConfig(db, collectionPath);
        const index = config.categories.findIndex((c) => c.id === id);
        if (index !== -1 && config.categories[index]) {
            config.categories[index]!.name = name;
            await this.saveConfig(db, collectionPath, config);
        }
    },

    async deleteCategory(db: Firestore, collectionPath: string, id: string): Promise<void> {
        const config = await this.getConfig(db, collectionPath);
        config.categories = config.categories.filter((c) => c.id !== id);
        await this.saveConfig(db, collectionPath, config);
    },

    async addTag(db: Firestore, collectionPath: string, name: string): Promise<string> {
        const config = await this.getConfig(db, collectionPath);
        const id = generateId();
        config.tags.push({ id, name });
        await this.saveConfig(db, collectionPath, config);
        return id;
    },

    async updateTag(db: Firestore, collectionPath: string, id: string, name: string): Promise<void> {
        const config = await this.getConfig(db, collectionPath);
        const index = config.tags.findIndex((t) => t.id === id);
        if (index !== -1 && config.tags[index]) {
            config.tags[index]!.name = name;
            await this.saveConfig(db, collectionPath, config);
        }
    },

    async deleteTag(db: Firestore, collectionPath: string, id: string): Promise<void> {
        const config = await this.getConfig(db, collectionPath);
        config.tags = config.tags.filter((t) => t.id !== id);
        await this.saveConfig(db, collectionPath, config);
    },
};
