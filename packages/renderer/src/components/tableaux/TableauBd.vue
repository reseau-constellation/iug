<template>
  <v-data-table
    :headers="entêtes"
    :items="filesTableau"
  >
    <template #top>
      <v-toolbar
        v-if="false"
        flat
        density="compact"
      >
        <v-toolbar-title>
          {{ nomTraduit || t('tableaux.sansNom') }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon="mdi-table-column-plus-after"></v-btn>
        <v-btn icon="mdi-sync"></v-btn>
        <v-btn icon="mdi-download"></v-btn>
      </v-toolbar>
    </template>
    <template #no-data>
      <p class="my-4 text-h6 text-disabled">{{ t('tableaux.aucuneDonnée') }}</p>
      <carte-importation
        :id-tableau="idTableau"
        :colonnes-tableau="colonnes || []"
      >
        <template #activator="{props: propsActivateur}">
          <v-btn
            v-bind="propsActivateur"
            class="mb-4"
            prepend-icon="mdi-import"
            variant="outlined"
          >
            {{ t('tableaux.importer') }}
          </v-btn>
        </template>
      </carte-importation>
    </template>

    <template
      v-for="c in colonnes"
      :key="c.id"
      #[`header.${c.id}`]
    >
      <entete-colonne-tableau
        :id-tableau="idTableau"
        :id-colonne="c.id"
        :id-variable="c.variable"
        :index="!!c.index"
        :permission-modifier="!!autorisation"
      />
    </template>
  </v-data-table>
</template>
<script setup lang="ts">
import type {tableaux} from '@constl/ipa';

import {computed} from 'vue';
import {constellation, suivre} from '../utils';
import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import EnteteColonneTableau from './EntêteColonneTableau.vue';
import CarteImportation from '/@/components/bds/CarteImportation.vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const constl = constellation();
const props = defineProps<{idTableau: string}>();

// Nom
const noms = suivre(constl.tableaux.suivreNomsTableau, {idTableau: props.idTableau});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(computed(() => noms.value || {}));

// Autorisation
const autorisation = suivre(constl.suivrePermission, {idObjet: props.idTableau});

// Colonnes
const colonnes = suivre(constl.tableaux.suivreColonnesTableau<tableaux.InfoColAvecCatégorie>, {
  idTableau: props.idTableau,
});
const entêtes = computed(() => {
  return (colonnes.value || []).map(c => ({
    key: c.id,
  }));
});

// Données
const données = suivre(constl.tableaux.suivreDonnées<tableaux.élémentBdListeDonnées>, {
  idTableau: props.idTableau,
});
const filesTableau = computed(() => {
  return données.value?.map(d => d.données);
});
</script>
