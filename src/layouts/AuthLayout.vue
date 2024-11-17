<template>
    <n-layout class="h-screen">
        <n-layout-content class="h-screen flex items-center justify-center">
            <router-view />
        </n-layout-content>
    </n-layout>
</template>

<script lang="ts" setup>
import { NLayout, NLayoutContent } from 'naive-ui'
</script>

<style scoped>
:deep(.n-layout-scroll-container) {
    height: 100vh !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}
</style>