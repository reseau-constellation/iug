<template>
  <span class="ms-2">
    {{ t('bds.qualité.titre') }}:
    <span
      :style="`color:${couleurScore(score !== undefined ? score : null).couleur}`"
      class="font-weight-bold"
    >
      {{
        score !== undefined
          ? t('bds.note.' + couleurScore(score).note)
          : t('communs.pointInterrogation')
      }}
    </span>
  </span>
</template>

<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed} from 'vue';

import {utiliserConstellation} from '/@/components/utils';
import {couleurScore} from '/@/utils';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

// Qualité BD
const qualité = suivre(constl.bds.suivreQualitéBd, {idBd: computed(() => props.id)});
const score = computed(() => {
  return qualité.value?.total;
});
</script>
