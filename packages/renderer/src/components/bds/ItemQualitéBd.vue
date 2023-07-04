<template>
  <v-list-item>
    <template #prepend>
      <icône-qualité-bd :id="id" />
    </template>
    <v-list-item-title>
      <texte-qualité-bd :id="id" />
    </v-list-item-title>
  </v-list-item>
</template>

<script setup lang="ts">
import IcôneQualitéBd from './IcôneQualitéBd.vue';
import TexteQualitéBd from './TexteQualitéBd.vue';

defineProps<{id: string}>();
</script>
