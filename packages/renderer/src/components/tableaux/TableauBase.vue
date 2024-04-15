<template>
  <v-data-table>
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
      <span class="text-h6 text-disabled">{{ t('tableaux.aucuneDonnnée') }}</span>
    </template>

    <template
      v-for="c in entêtes"
      :key="c.key"
      #[`header.${c.key}`]="{column}"
    >
      {{ column }}
      <carte-colonne-tableau :permission-modifier="permissionModifier">
        <template #activator="{props: propsActivateur}">
          <span v-bind="propsActivateur">{{ c.title }}</span>
        </template>
      </carte-colonne-tableau>
    </template>
    <template
      v-for="c in entêtes"
      :key="c.key"
      #[`item.${c.key}`]="{item}"
    >
      {{ item }}
    </template>
  </v-data-table>
</template>
<script setup lang="ts">
import type {tableaux, variables} from '@constl/ipa';

import CarteColonneTableau from './CarteColonneTableau.vue';
import {computed} from 'vue';
import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {useDisplay} from 'vuetify/lib/framework.mjs';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

const props = defineProps<{
  permissionModifier: boolean;
  noms?: {[langue: string]: string};
  colonnes?: tableaux.InfoColAvecCatégorie[];
  donnees?: tableaux.élémentBdListeDonnées[];
}>();

// Nom
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(computed(() => props.noms || {}));

// Entêtes
const entêtes = computed(() => {
  return props.colonnes?.map(c => {
    return {
      title: c.variable,
      key: c.id,
      index: c.index,
      sortable: c.catégorie?.type === 'simple' ? triable(c.catégorie.catégorie) : false,
      info: {
        catégorie: c.catégorie,
      },
    };
  });
});

const triables: variables.catégorieBaseVariables[] = [
  'booléen',
  'chaîne',
  'horoDatage',
  'intervaleTemps',
  'numérique',
];
const triable = (catégorieBase: variables.catégorieBaseVariables): boolean => {
  return triables.includes(catégorieBase);
};
</script>
