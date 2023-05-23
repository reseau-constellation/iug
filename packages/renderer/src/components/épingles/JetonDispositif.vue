<template>
  <v-chip>{{ id.slice(0, 20) }}...</v-chip>
</template>
<script setup lang="ts">
defineProps<{id: string}>();
</script>