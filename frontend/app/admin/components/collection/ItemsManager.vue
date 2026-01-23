<!-- Chức năng: Quản lý danh sách items (collection view) với toolbar và search -->
<template>
    <div class="items-content">
        <div class="items-toolbar">
            <div class="search-box">
                <Icon name="mdi:magnify" />
                <input v-model="internalSearchQuery" type="text" placeholder="Tìm kiếm..." class="search-input" />
            </div>

            <div class="toolbar-actions">
                <button class="config-btn categories-btn" @click="$emit('manage-categories')">
                    <Icon name="mdi:folder-multiple" />
                    <span>Danh mục</span>
                </button>
                <button class="config-btn tags-btn" @click="$emit('manage-tags')">
                    <Icon name="mdi:tag-multiple" />
                    <span>Tags</span>
                </button>

                <div class="toolbar-divider"></div>

                <select v-if="listConfig?.sortOptions" v-model="internalSortBy" class="filter-select">
                    <option value="">Sắp xếp...</option>
                    <option v-for="opt in listConfig.sortOptions" :key="opt.field + opt.direction" :value="opt.field + ':' + opt.direction">
                        {{ opt.label }}
                    </option>
                </select>

                <select v-for="filter in listConfig?.filterBy" :key="filter.field" v-model="internalFilters[filter.field]" class="filter-select">
                    <option value="">{{ filter.label }}</option>
                    <option v-for="opt in filter.options" :key="String(opt)" :value="opt">{{ opt }}</option>
                </select>
            </div>
        </div>

        <ItemsList :items="paginatedItems" :columns="columns" :item-config="itemConfig" @add="$emit('add')" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" />

        <div v-if="totalPages > 1" class="pagination">
            <button :disabled="currentPage === 1" @click="currentPage--">
                <Icon name="mdi:chevron-left" />
            </button>
            <span>{{ currentPage }} / {{ totalPages }}</span>
            <button :disabled="currentPage === totalPages" @click="currentPage++">
                <Icon name="mdi:chevron-right" />
            </button>
        </div>
    </div>
</template>

<style scoped>
@import "../../styles/components/collection/items-manager.css";
</style>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import ItemsList from "./ItemsList.vue";
import type { TableColumn, ListingConfig } from "../../config/page.config";

const props = defineProps<{
    items: Record<string, unknown>[];
    columns: TableColumn[];
    itemConfig: { name: string; namePlural: string; icon: string };
    listConfig?: ListingConfig;
}>();

const emit = defineEmits<{
    add: [];
    edit: [item: Record<string, unknown>];
    delete: [item: Record<string, unknown>];
    "manage-categories": [];
    "manage-tags": [];
}>();

const internalSearchQuery = ref("");
const internalSortBy = ref("");
const internalFilters = ref<Record<string, string>>({});
const currentPage = ref(1);
const itemsPerPage = 10;

const filteredItems = computed(() => {
    let result = [...props.items];

    // Filter by Search Query
    if (internalSearchQuery.value) {
        const query = internalSearchQuery.value.toLowerCase();
        const searchFields = props.listConfig?.searchFields || ["name", "title"];
        result = result.filter((item) => searchFields.some((field: string) => String(item[field] || "").toLowerCase().includes(query)));
    }

    // Filter by Active Filters
    for (const [key, val] of Object.entries(internalFilters.value)) {
        if (val) {
            result = result.filter((item) => item[key] === val);
        }
    }

    // Sort
    if (internalSortBy.value) {
        const [field, direction] = internalSortBy.value.split(":");
        if (field) {
            result = [...result].sort((a, b) => {
                const aVal = a[field];
                const bVal = b[field];
                const mult = direction === "desc" ? -1 : 1;
                if (typeof aVal === "string") return mult * (aVal as string).localeCompare(bVal as string);
                return mult * ((aVal as number) - (bVal as number));
            });
        }
    }

    return result;
});

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage) || 1);

const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredItems.value.slice(start, start + itemsPerPage);
});

watch([internalSearchQuery, internalSortBy, internalFilters], () => {
    currentPage.value = 1;
});
</script>

<style scoped></style>
