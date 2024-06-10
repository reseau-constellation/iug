<template>
  <v-chip
    label
    variant="outlined"
  >
    {{ nom }}
  </v-chip>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';
import {suivre, utiliserNuchabäl} from '/@/components/utils';
import {computed} from 'vue';

const props = defineProps<{code: string}>();

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
</script>
