<template>
  <v-data-table
    :headers="entêtes"
    :items="filesTableau"
  >
    <template #top>
      <v-toolbar
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
      <span class="text-h6 text-disabled">{{ t('tableaux.aucuneDonnée') }}</span>
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

import {utiliserConstellation, rechercher, suivre} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const constl = utiliserConstellation();
const props = defineProps<{idNuée: string; idTableau: string; clefTableau: string}>();

// Nom
const noms = suivre(constl.tableaux.suivreNomsTableau, {idTableau: props.idTableau});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(computed(() => noms.value));

// Autorisation
const autorisation = suivre(constl.suivrePermission, {idObjet: props.idTableau});

// Données
const monCompte = suivre(constl.suivreIdCompte);
const {résultats: données} = rechercher(
  constl.nuées.suivreDonnéesTableauNuée<tableaux.élémentBdListeDonnées>,
  {
    idNuée: props.idNuée,
    clefTableau: props.clefTableau,
  },
);
const filesTableau = computed(() => {
  return données.value?.map(d => ({
    ...d.élément,
    contributeur: d.idCompte,
    éditable: d.idCompte === monCompte.value,
  }));
});

// Colonnes
const colonnes = suivre(constl.nuées.suivreColonnesTableauNuée<tableaux.InfoColAvecCatégorie>, {
  idNuée: props.idNuée,
  clefTableau: props.clefTableau,
  catégories: true,
});
const entêtes = computed(() => {
  return (colonnes.value || []).map(c => ({
    key: c.id,
  }));
});
</script>
