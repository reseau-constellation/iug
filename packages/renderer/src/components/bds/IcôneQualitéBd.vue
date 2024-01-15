<template>
  <v-progress-circular
    :rotate="score ? 270 : undefined"
    :value="score ? score * 100 : 0"
    :indeterminate="!score"
    :color="score ? couleurScore(score).couleur : 'grey lighten-2'"
    :size="15"
    :width="3"
  />
</template>

<script setup lang="ts">
import type {bds} from '@constl/ipa';

import {computed, ref} from 'vue';
import {constellation, enregistrerÉcoute} from '/@/components/utils';
import {couleurScore} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = constellation();

// Qualité BD
const qualité = ref<bds.infoScore>();
enregistrerÉcoute(
  constl.bds.suivreQualitéBd({
    idBd: props.id,
    f: x => (qualité.value = x),
  }),
);
const score = computed(() => {
  return qualité.value?.total;
});
</script>
