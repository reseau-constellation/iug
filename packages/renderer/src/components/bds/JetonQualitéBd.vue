<template>
  <v-chip
    class="mb-2 me-2"
    variant="outlined"
    label
  >
    <template #prepend>
      <icône-qualité-bd :id="id" />
    </template>

    <texte-qualité-bd :id="id" />
  </v-chip>
</template>

<script setup lang="ts">
import IcôneQualitéBd from './IcôneQualitéBd.vue';
import TexteQualitéBd from './TexteQualitéBd.vue';

defineProps<{id: string}>();
</script>
