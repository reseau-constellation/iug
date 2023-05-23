<template>
  <v-list-item>
    <template #title> {{ id.slice(0, 20) }}... </template>
  </v-list-item>
</template>
<script setup lang="ts">
defineProps<{id: string}>();
</script>
