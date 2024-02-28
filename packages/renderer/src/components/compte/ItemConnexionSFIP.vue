<template>
  <v-list-item>
    <template #prepend>
      <v-icon>mdi-web</v-icon>
    </template>
    <v-list-item-title>{{ pair }}</v-list-item-title>
    <v-list-item-subtitle>{{ adresses[0] }}</v-list-item-subtitle>
  </v-list-item>
</template>
<script setup lang="ts">
defineProps<{adresses: string[]; pair: string}>();
</script>
