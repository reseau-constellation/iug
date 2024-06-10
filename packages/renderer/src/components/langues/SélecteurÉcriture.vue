<template>
  <v-select
    v-model="sélection"
    variant="outlined"
    :items="écritures"
  >
    <template #item="{props, item}">
      <item-ecriture
        v-bind="props"
        :code="item.raw"
      />
    </template>
    <template #selection="{item}">
      <jeton-ecriture :code="item.raw" />
    </template>
    <template #append>
      <nouvelle-ecriture @suggestion="({code}) => (sélection = code)">
        <template #activator="{props: propsActivateur}">
          <v-icon
            icon="mdi-plus"
            v-bind="propsActivateur"
          />
        </template>
      </nouvelle-ecriture>
    </template>
  </v-select>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import {ref} from 'vue';

import {suivre, utiliserNuchabäl} from '../utils';

import ItemEcriture from './contribuer/nuchabäl/ItemÉcriture.vue';
import JetonEcriture from './contribuer/nuchabäl/JetonÉcriture.vue';
import {watchEffect} from 'vue';
import NouvelleEcriture from './contribuer/nuchabäl/NouvelleÉcriture.vue';

const émettre = defineEmits<{
  (é: 'selectionnee', args: {code?: string}): void;
}>();

const nuchabäl = utiliserNuchabäl();

// Écritures disponibles
const écritures = suivre(async ({f}: {f: types.schémaFonctionSuivi<string[] | undefined>}) => {
  const fRetour = nuchabäl.tatzeqelbejKonojelTzibanem({sm: f});
  return async () => fRetour();
});

// Sélection
const sélection = ref<string>();
watchEffect(() => {
  émettre('selectionnee', {code: sélection.value});
});
</script>
