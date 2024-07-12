<template>
  <v-progress-circular
    :rotate="score !== undefined ? 270 : undefined"
    :model-value="score !== undefined ? score * 100 : 0"
    :indeterminate="score === undefined"
    :color="score !== undefined ? couleurScore(score).couleur : 'grey lighten-2'"
    :size="25"
    :width="5"
  />
</template>

<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed} from 'vue';

import {utiliserConstellation} from '/@/components/utils';
import {couleurScore} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

// Qualité BD
const qualité = suivre(constl.bds.suivreQualitéBd, {idBd: props.id});
const score = computed(() => {
  return qualité.value?.total;
});
</script>
