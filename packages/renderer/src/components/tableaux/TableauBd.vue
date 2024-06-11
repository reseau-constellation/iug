<template>
  <v-data-table
    v-model="sélectionnées"
    :headers="entêtes"
    :items="filesTableau"
    :show-select="!!autorisation"
    multi-sort
    @update:sort-by="val => ordonnerPar = val"
  >
    <template #top>
      <v-toolbar
        flat
        density="compact"
      >
        <v-spacer />
        <nouvelle-ligne
          v-if="colonnes && autorisation"
          :colonnes="colonnes"
          :regles="règles"
          @sauvegarder="vals => ajouterLigne(vals)"
        >
          <template #activator="{props: propsActivateur}">
            <v-btn
              v-bind="propsActivateur"
              icon="mdi-table-row-plus-after"
            >
            </v-btn>
          </template>
        </nouvelle-ligne>
        <nouvelle-colonne
          :id-tableau="idTableau"
          :variables-interdites="variables"
          @nouvelle="col => ajouterColonne(col)"
        >
          <template #activator="{props: propsActivateur}">
            <v-btn
              v-bind="propsActivateur"
              icon="mdi-table-column-plus-after"
            ></v-btn>
          </template>
        </nouvelle-colonne>
        <v-btn icon="mdi-sync"></v-btn>
        <v-btn icon="mdi-download"></v-btn>
      </v-toolbar>
    </template>

    <template #no-data>
      <p class="my-4 text-h6 text-disabled">{{ t('tableaux.aucuneDonnée') }}</p>
      <nouvelle-importation
        type="importation"
        :info-objet="{id: idTableau, typeObjet: 'tableau'}"
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
      </nouvelle-importation>
    </template>

    <template
      v-for="c in entêtes || []"
      :key="c.key"
      #[`header.${c.key}`]="{column, isSorted, getSortIcon, toggleSort}"
    >
      <entete-colonne-tableau
        :id-colonne="c.key"
        :id-variable="c.info.variable"
        :id-tableau="idTableau"
        :index="!!c.info.index"
        :regles="règles"
        :permission-modifier="!!autorisation"
        :ordonnable="column.sortable"
        :est-ordonnee="isSorted(column)"
        :icone-ordonner="getSortIcon(column) as string"
        @basculer-ordonner="() => toggleSort(column)"
      />
    </template>

    <template
      v-for="c in entêtes"
      :key="c.key"
      #[`item.${c.key}`]="{item}"
    >
      <cellule-tableau
        :categorie="c.info.catégorie?.catégorie"
        :val="item.données[c.key]"
      />
    </template>
  </v-data-table>
</template>
<script setup lang="ts">
import type {tableaux, valid, variables as typesVariables} from '@constl/ipa';

import {computed, ref} from 'vue';
import {constellation, suivre} from '../utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import EnteteColonneTableau from './EntêteColonneTableau.vue';
import NouvelleImportation from '/@/components/automatisations/NouvelleImportation.vue';
import NouvelleColonne from './NouvelleColonne.vue';
import NouvelleLigne from './NouvelleLigne.vue';
import CelluleTableau from './cellules/CelluleTableau.vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = constellation();
const props = defineProps<{idTableau: string}>();

// Autorisation
const autorisation = suivre(constl.suivrePermission, {idObjet: props.idTableau});

// Variables
const variables = suivre(constl.tableaux.suivreVariables, {idTableau: props.idTableau});

// Colonnes
const colonnes = suivre(constl.tableaux.suivreColonnesTableau<tableaux.InfoColAvecCatégorie>, {
  idTableau: props.idTableau,
});
const entêtes = computed(() => {
  return (colonnes.value || []).map(c => ({
    key: c.id,
    sortable: c.catégorie === undefined ||( c.catégorie?.type === 'simple' ? triable(c.catégorie.catégorie) : false),
    info: {
      index: c.index,
      catégorie: c.catégorie,
      variable: c.variable,
    },
  }));
});
const triables: typesVariables.catégorieBaseVariables[] = [
  'booléen',
  'chaîne',
  'horoDatage',
  'intervaleTemps',
  'numérique',
];
const triable = (catégorieBase: typesVariables.catégorieBaseVariables): boolean => {
  return triables.includes(catégorieBase);
};

const ajouterColonne = async ({
  idVariable,
  idColonne,
  index,
  règles,
}: {
  idVariable: string;
  idColonne?: string | undefined;
  index: boolean;
  règles: valid.règleVariable[];
}) => {
  idColonne = await constl.tableaux.ajouterColonneTableau({
    idTableau: props.idTableau,
    idVariable,
    idColonne,
  });
  if (index)
    await constl.tableaux.changerColIndex({
      idTableau: props.idTableau,
      idColonne,
      val: true,
    });
  for (const règle of règles) {
    await constl.tableaux.ajouterRègleTableau({
      idTableau: props.idTableau,
      idColonne,
      règle,
    });
  }
};

// Données
const données = suivre(constl.tableaux.suivreDonnées<tableaux.élémentBdListeDonnées>, {
  idTableau: props.idTableau,
});
const filesTableau = computed(() => {
  return données.value?.toSorted((a, b) => {
    if (!ordonnerPar.value) return 0;
    else {
      return ordonnerPar.value.map(o => {
        return a.données[o.key] > b.données[o.key] ? (o.order === 'asc' ? 1 : -1) : (a.données[o.key] < b.données[o.key] ? (o.order === 'asc' ? -1 : 1) : 0);
      }).find(x=>x !== 0) || 0;
    }
  });
});
const ajouterLigne = async (vals: tableaux.élémentBdListeDonnées) => {
  await constl.tableaux.ajouterÉlément({
    idTableau: props.idTableau,
    vals,
  });
};

const ordonnerPar = ref<{key: string, order: 'asc' | 'desc'}[]>();

// Sélection files
const sélectionnées = ref([]);


// Règles
const règles = suivre(constl.tableaux.suivreRègles, {idTableau: props.idTableau});
</script>
