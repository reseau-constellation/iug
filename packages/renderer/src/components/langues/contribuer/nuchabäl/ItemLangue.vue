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
      {{ t('nuchabäl.écriture.système') }} {{ écriture }}
    </v-chip>
    <v-chip
      v-for="[sys, cd] in Object.entries(codesFinaux)"
      :key="sys"
      variant="outlined"
      size="small"
    >
      {{ t(`nuchabäl.écriture.codes.${cd}`) }} {{ cd }}
    </v-chip>
    <slot></slot>
  </v-list-item>
</template>
<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import JetonNumeration from '/@/components/langues/JetonNumération.vue';

const props = defineProps<{
  nom: string;
  code: string;
  écriture: string;
  numération?: string;
  codes?: {[système: string]: string | undefined};
}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const codesFinaux = computed(() => {
  const finaux: {[système: string]: string} = {
    nuchabäl: props.code,
  };

  Object.entries(props.codes || {}).forEach(([sys, cd]) => {
    if (cd) finaux[sys] = cd;
  });
  return finaux;
});
</script>
