<template>
  <v-list-item>
    <template #title>
      {{ nom }}
    </template>
    <jeton-numeration :code="numeration">{{ t('nuchabäl.numération') }}</jeton-numeration>
    <v-chip
      variant="outlined"
      size="small"
    >
      {{ t('nuchabäl.direction') }} {{ direction }}
    </v-chip>
    <v-chip
      variant="outlined"
      size="small"
    >
      {{ t('nuchabäl.code') }} {{ code }}
    </v-chip>
    <slot></slot>
  </v-list-item>
</template>
<script setup lang="ts">
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import JetonNumeration from '/@/components/langues/JetonNumération.vue';

defineProps<{nom: string; code: string; numeration: string; direction: string}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
</script>
