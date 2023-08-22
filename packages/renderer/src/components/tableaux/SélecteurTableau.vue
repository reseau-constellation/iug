<template>
  <v-select
    v-model="idTableauSélectionné"
    :loading="!tableaux"
    :disabled="!tableaux"
    :items="tableaux"
    item-value="id"
    item-title="id"
  >
    <template #selection="{item}">
      <jeton-tableau :id="item.value" />
    </template>
    <template #item="{item}">
      <item-tableau :id="item.value" />
    </template>
  </v-select>
</template>
<script setup lang="ts">
import type { bds, types} from '@constl/ipa';
import type {MandataireClientConstellation} from '@constl/mandataire';

import {inject, ref, watchEffect} from 'vue';

import ItemTableau from './ItemTableau.vue';
import {enregistrerÉcoute} from '../utils';

const props = defineProps<{idBd?: string}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idTableau?: string): void;
}>();

const constl = inject<MandataireClientConstellation>('constl');

// Tableaux
const tableaux = ref<bds.infoTableauAvecId[]>();
let oublierTableaux: types.schémaFonctionOublier | undefined;
watchEffect(async () => {
  if (oublierTableaux) await oublierTableaux();
  if (props.idBd) {
    oublierTableaux = await enregistrerÉcoute(
      constl?.bds.suivreTableauxBd({idBd: props.idBd, f: x => (tableaux.value = x)}),
    );
  } else {
    tableaux.value = undefined;
  }
});

// Contrôles
const idTableauSélectionné = ref<string>();
watchEffect(() => {
  émettre('selectionnee', idTableauSélectionné.value);
});
</script>
