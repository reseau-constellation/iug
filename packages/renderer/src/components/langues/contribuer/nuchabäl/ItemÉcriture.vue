<template>
  <v-list-item>
    <template #title>
      <p class="mb-2">{{ nom }}</p>
    </template>
    <template #prepend>
      <v-avatar>{{ code }}</v-avatar>
    </template>
    <jeton-numeration
      v-if="numération"
      class="me-2"
      :code="numération"
    >
      {{ t('nuchabäl.numération') }}
    </jeton-numeration>
    <v-chip
      v-if="direction"
      class="me-2"
      variant="outlined"
      size="small"
      label
    >
      {{ t('nuchabäl.direction') }} {{ direction }}
    </v-chip>
    <slot></slot>
  </v-list-item>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';
import {suivre} from '@constl/vue';
import {computed} from 'vue';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserNuchabäl} from '/@/components/utils';

import JetonNumeration from '/@/components/langues/JetonNumération.vue';

const props = defineProps<{code: string}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const nuchabäl = utiliserNuchabäl();

const nom = suivre(
  async ({runuk, f}: {runuk: string; f: types.schémaFonctionSuivi<string | undefined>}) => {
    const fRetour = nuchabäl.tatzeqelbejRubiTzibanem({runuk, sm: f});
    return async () => fRetour();
  },
  {
    runuk: computed(() => props.code),
  },
);

const numération = suivre(
  async ({runuk, f}: {runuk: string; f: types.schémaFonctionSuivi<string | undefined>}) => {
    const fRetour = nuchabäl.tatzeqelbejRajilanïkTzibanem({runuk, sm: f});
    return async () => fRetour();
  },
  {
    runuk: computed(() => props.code),
  },
);

const direction = suivre(
  async ({runuk, f}: {runuk: string; f: types.schémaFonctionSuivi<string | undefined>}) => {
    const fRetour = nuchabäl.tatzeqelbejRucholanemTzibanem({runuk, sm: f});
    return async () => fRetour();
  },
  {
    runuk: computed(() => props.code),
  },
);
</script>
