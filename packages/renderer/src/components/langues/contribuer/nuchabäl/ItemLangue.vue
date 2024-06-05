<template>
  <v-list-item>
    <template #title>
      {{ nom }}
    </template>
    <jeton-numeration
      v-if="numération"
      :code="numération"
    >
      {{ t('nuchabäl.numération') }}
    </jeton-numeration>
    <v-chip
      variant="outlined"
      size="small"
    >
      {{ t('nuchabäl.écriture') }} {{ écriture }}
    </v-chip>
    <v-chip
      v-for="[sys, cd] in Object.entries(codesFinaux)"
      :key="sys"
      variant="outlined"
      size="small"
    >
      {{ t(`nuchabäl.codesÉcriture.${cd}`) }} {{ cd }}
    </v-chip>
    <slot></slot>
  </v-list-item>
</template>
<script setup lang="ts">
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import JetonNumeration from '/@/components/langues/JetonNumération.vue';
import { computed } from 'vue';

const props = defineProps<{
  nom: string;
  code: string;
  écriture: string;
  numération?: string;
  codes?: {[système: string]: string | undefined};
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const codesFinaux = computed(()=>{
  const finaux: {[système: string]: string} = {
    nuchabäl: props.code,
  };

  Object.entries(props.codes || {}).forEach(([sys, cd]) => {
    if (cd) finaux[sys] = cd;
  });
  return finaux;
});
</script>
