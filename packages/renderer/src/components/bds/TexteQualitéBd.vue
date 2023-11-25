<template>
  <span class="ms-2">
    {{ t('bds.qualité') }}:
    <span
      :style="`color:${couleurScore(score ? score : null).couleur}`"
      class="font-weight-bold"
    >
      {{ score ? t('bds.note.' + couleurScore(score).note) : t('communs.pointInterrogation') }}
    </span>
  </span>
</template>

<script setup lang="ts">
import type {bds} from '@constl/ipa';
import type {ClientConstellation} from '@constl/ipa';

import {computed, inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/components/utils';
import {couleurScore} from '/@/utils';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

// Qualité BD
const qualité = ref<bds.infoScore>();
enregistrerÉcoute(
  constl?.bds.suivreQualitéBd({
    idBd: props.id,
    f: x => (qualité.value = x),
  }),
);
const score = computed(() => {
  return qualité.value?.total;
});
</script>
