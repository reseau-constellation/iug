<template>
  <v-list-item>
    <template #prepend>
      <icone-qualite-bd :id="id" />
    </template>
    <v-list-item-title>
      <texte-qualite-bd :id="id" />
    </v-list-item-title>
  </v-list-item>
</template>

<script setup lang="ts">
import IconeQualiteBd from './IcôneQualitéBd.vue';
import TexteQualiteBd from './TexteQualitéBd.vue';

defineProps<{id: string}>();
</script>
