<template>
  <v-list-item>
    <template #title>
      {{ nom }}
    </template>
    {{ numération }}
  </v-list-item>
</template>
<script setup lang="ts">
defineProps<{nom: string, numération: string}>();
</script>
