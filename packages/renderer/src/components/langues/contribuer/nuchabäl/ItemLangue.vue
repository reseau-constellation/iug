<template>
  <v-list-item>
    <template #title>
      {{ nom }}
    </template>
    {{ écriture }}
  </v-list-item>
</template>
<script setup lang="ts">
defineProps<{nom: string, écriture: string}>();
</script>
