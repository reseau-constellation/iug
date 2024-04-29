<template>
  <v-chip
    variant="outlined"
    label
  >
    <template #prepend>
      <icone-qualite-bd :id="id" />
    </template>

    <texte-qualite-bd :id="id" />
  </v-chip>
</template>

<script setup lang="ts">
import IconeQualiteBd from './IcôneQualitéBd.vue';
import TexteQualiteBd from './TexteQualitéBd.vue';

defineProps<{id: string}>();
</script>
