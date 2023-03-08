<template>
  <v-chip variant="outlined">
    <slot>
      {{ id.slice(7, 17) + '...' }}
    </slot>
    <template #append>
      <LienObjet :id="id" />
    </template>
  </v-chip>
</template>

<script setup lang="ts">
import LienObjet from './LienObjet.vue';

defineProps<{id: string}>();
</script>
