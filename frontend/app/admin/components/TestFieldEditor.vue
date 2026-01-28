<template>
    <div class="test-editor">
        <h3>Test Data-Field</h3>
        <p :data-field="'testField'">Click me to test</p>
        <p>Section ID: {{ sectionId }}</p>
        <p>Enabled: {{ enabled }}</p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    sectionId?: string
    enabled?: boolean
}>()
</script>

<style scoped>
.test-editor {
    padding: 20px;
    border: 2px solid blue;
    margin: 10px;
}
</style>
