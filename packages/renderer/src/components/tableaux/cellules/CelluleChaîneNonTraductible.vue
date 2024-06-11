<template>
  <texte-tronque
    v-if="valValide"
    :texte="valValide"
    :longueur-max="10"
  />
  <v-icon
    v-if="!valValide"
    size="small"
    color="error"
    icon="mdi-error"
  />
  <!--<template #item.calories="{item}">
    <p
      contenteditable
      @input="changerValeur"
      >{{ item.columns.calories }}</p
    >
  </template>
  <template #item.fat="{item}">
    <p
      contenteditable
      @input="changerValeur"
      >{{ item.columns.calories }}</p
    >
  </template> -->
</template>
<script setup lang="ts">
import type { types } from '@constl/ipa';
import TexteTronque from '/@/components/communs/TexteTronqué.vue';
import { computed } from 'vue';

const props = defineProps<{val?: types.élémentsBd}>();

const valValide = computed(()=>typeof props.val === 'string' ? props.val : undefined);
</script>
