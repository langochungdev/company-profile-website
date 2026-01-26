<script setup>
import { useCollectionConfig } from '@/admin/composables/useCollectionConfig'

const { config, loadConfig } = useCollectionConfig('collections/services/items')

await loadConfig()

const firstCategorySlug = computed(() => {
    if (config.value?.categories?.length > 0) {
        const categoryName = config.value.categories[0].name
        return categoryName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }
    return 'camera-ai'
})

navigateTo(`/service/${firstCategorySlug.value}`)
</script>
