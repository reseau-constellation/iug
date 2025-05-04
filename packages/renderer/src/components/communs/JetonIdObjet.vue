<template>
  <v-chip
    variant="outlined"
    size="small"
    label
  >
    <slot>
      {{ id.slice(7, 17) + t('communs.troisPetitsPoints') }}
    </slot>
    <template #append>
      <LienObjet :id="id" />
    </template>
  </v-chip>
</template>

<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import LienObjet from './LienObjet.vue';

defineProps<{id: string}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
</script>
