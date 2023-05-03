<template>
  <v-list-item>
    <template #prepend>
      <v-icon>mdi-web</v-icon>
    </template>
    <v-list-item-title>{{ adresse }}</v-list-item-title>
    <v-list-item-subtitle>{{ pair }}</v-list-item-subtitle>
  </v-list-item>
</template>
<script setup lang="ts">
defineProps<{adresse: string; pair: string}>();
</script>
