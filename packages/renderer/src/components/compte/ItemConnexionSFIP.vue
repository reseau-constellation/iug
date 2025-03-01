<template>
  <v-list-item>
    <template #prepend>
      <v-icon>mdi-web</v-icon>
    </template>
    <v-list-item-title>{{ pair }}</v-list-item-title>
    <p
      v-for="a in adresses"
      :key="a"
      class="text-disabled"
    >
      {{ a }}
    </p>
  </v-list-item>
</template>
<script setup lang="ts">
defineProps<{adresses: string[]; pair: string}>();
</script>
