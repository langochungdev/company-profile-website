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
    async getConfig(db: Firestore, fullPath: string): Promise<CollectionConfig> {
        const docRef = doc(db, fullPath);
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

    async saveConfig(db: Firestore, fullPath: string, data: CollectionConfig): Promise<void> {
        const docRef = doc(db, fullPath);
        await setDoc(docRef, data);
    },

    async addCategory(db: Firestore, fullPath: string, name: string): Promise<string> {
        const config = await this.getConfig(db, fullPath);
        const id = generateId();
        config.categories.push({ id, name });
        await this.saveConfig(db, fullPath, config);
        return id;
    },

    async updateCategory(db: Firestore, fullPath: string, id: string, name: string): Promise<void> {
        const config = await this.getConfig(db, fullPath);
        const index = config.categories.findIndex((c) => c.id === id);
        if (index !== -1 && config.categories[index]) {
            config.categories[index]!.name = name;
            await this.saveConfig(db, fullPath, config);
        }
    },

    async deleteCategory(db: Firestore, fullPath: string, id: string): Promise<void> {
        const config = await this.getConfig(db, fullPath);
        config.categories = config.categories.filter((c) => c.id !== id);
        await this.saveConfig(db, fullPath, config);
    },

    async addTag(db: Firestore, fullPath: string, name: string): Promise<string> {
        const config = await this.getConfig(db, fullPath);
        const id = generateId();
        config.tags.push({ id, name });
        await this.saveConfig(db, fullPath, config);
        return id;
    },

    async updateTag(db: Firestore, fullPath: string, id: string, name: string): Promise<void> {
        const config = await this.getConfig(db, fullPath);
        const index = config.tags.findIndex((t) => t.id === id);
        if (index !== -1 && config.tags[index]) {
            config.tags[index]!.name = name;
            await this.saveConfig(db, fullPath, config);
        }
    },

    async deleteTag(db: Firestore, fullPath: string, id: string): Promise<void> {
        const config = await this.getConfig(db, fullPath);
        config.tags = config.tags.filter((t) => t.id !== id);
        await this.saveConfig(db, fullPath, config);
    },
};
