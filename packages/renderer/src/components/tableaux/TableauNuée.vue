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
        <v-spacer />
        <nouvelle-colonne
          v-if="autorisation"
          :id-tableau="idTableau"
          :variables-interdites="variables"
          @nouvelle="col => ajouterColonne(col)"
        >
          <template #activateur="{props: propsActivateur}">
            <v-btn
              v-bind="propsActivateur"
              icon="mdi-table-column-plus-after"
            ></v-btn>
          </template>
        </nouvelle-colonne>
        <carte-code-tableau-nuee
          :id-nuee="idNuee"
          :clef-tableau="clefTableau"
        >
          <template #activateur="{props: propsActivateurCarte}">
            <v-tooltip
              :text="t('code.indice')"
              :open-delay="200"
              location="bottom"
            >
              <template #activator="{props: propsActivateurIndice}">
                <v-btn
                  v-bind="{...propsActivateurCarte, ...propsActivateurIndice}"
                  icon="mdi-xml"
                />
              </template>
            </v-tooltip>
          </template>
        </carte-code-tableau-nuee>
        <carte-effacer
          v-if="autorisation"
          @effacer="() => effacerTableau()"
        >
          <template #activateurctivator="{props: propsActivateur}">
            <v-btn
              v-bind="propsActivateur"
              icon="mdi-delete"
              color="error"
            />
          </template>
        </carte-effacer>
      </v-toolbar>
    </template>
    <template #no-data>
      <span class="text-h6 text-disabled">{{ t('tableaux.aucuneDonnée') }}</span>
    </template>

    <template
      v-for="c in colonnesVariables"
      :key="c.key"
      #[`header.${c.key}`]="{column, isSorted, getSortIcon, toggleSort}"
    >
      <entete-colonne-tableau
        :id-colonne="c.key"
        :id-variable="c.info.variable"
        :id-tableau="idTableau"
        :index="!!c.info.index"
        :regles="règles?.filter(r => r.colonne === c.key)"
        :permission-modifier="!!autorisation"
        :ordonnable="column.sortable"
        :est-ordonnee="isSorted(column)"
        :icone-ordonner="getSortIcon(column) as string"
        @basculer-ordonner="() => toggleSort(column)"
        @sauvegarder="info => modifierColonne({idColonne: c.key, ...info})"
        @effacer="() => effacerColonne({idColonne: c.key})"
      />
    </template>

    <template
      v-for="c in colonnesVariables"
      :key="c.key"
      #[`item.${c.key}`]="{item}"
    >
      <cellule-tableau
        :categorie="c.info.catégorie?.catégorie"
        :val="item[c.key]"
        :editable="false"
      />
    </template>

    <template #[`header.idCompte`]="{column, isSorted, getSortIcon, toggleSort}">
      <span @click="() => toggleSort(column)">
        <v-hover v-slot="{isHovering, props: propsSurvole}">
          <span v-bind="propsSurvole">
            {{ t('nuées.tableau.entêteContributrice') }}
            <template v-if="column.sortable">
              <v-icon
                v-if="isSorted(column)"
                :icon="getSortIcon(column)"
              ></v-icon>
              <v-icon
                v-else
                icon="mdi-arrow-up"
                :color="isHovering ? 'disabled' : 'rgba(255,255,255,0)'"
              ></v-icon>
            </template>
          </span>
        </v-hover>
      </span>
    </template>
    <template #[`item.idCompte`]="{item}">
      <jeton-membre :compte="item.idCompte" />
    </template>
  </v-data-table>
</template>
<script setup lang="ts">
import type {tableaux, valid} from '@constl/ipa';

import {rechercher, suivre} from '@constl/vue';
import {computed, ref} from 'vue';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import CelluleTableau from './cellules/CelluleTableau.vue';
import EnteteColonneTableau from './EntêteColonneTableau.vue';
import NouvelleColonne from './NouvelleColonne.vue';
import {triable} from './utils';
import CarteEffacer from '/@/components/communs/CarteEffacer.vue';
import JetonMembre from '/@/components/membres/JetonMembre.vue';
import CarteCodeTableauNuee from '/@/components/tableaux/CarteCodeTableauNuée.vue';
import {utiliserConstellation} from '/@/components/utils';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const constl = utiliserConstellation();
const props = defineProps<{idNuee: string; idTableau: string; clefTableau: string}>();

// Autorisation
const autorisation = suivre(constl.suivrePermission, {idObjet: computed(() => props.idTableau)});

// Variables
const variables = suivre(constl.tableaux.suivreVariables, {
  idTableau: computed(() => props.idTableau),
}); // à faire: .nuées.

// Règles
const règles = suivre(constl.nuées.suivreRèglesTableauNuée, {
  idNuée: computed(() => props.idNuee),
  clefTableau: computed(() => props.clefTableau),
});

// Données
const {résultats: données} = rechercher(
  constl.nuées.suivreDonnéesTableauNuée<tableaux.élémentBdListeDonnées>,
  {
    idNuée: computed(() => props.idNuee),
    clefTableau: computed(() => props.clefTableau),
  },
);
const donnéesAvecCompte = computed(() => {
  return données.value?.map(d => {
    return Object.assign({}, d.élément.données, {idCompte: d.idCompte});
  });
});

const filesTableau = computed(() => {
  const ordonnées = donnéesAvecCompte.value?.toSorted((a, b) => {
    if (!ordonnerPar.value) return 0;
    else {
      return (
        ordonnerPar.value
          .map(o => {
            if (a[o.key] === undefined)
              return b[o.key] === undefined ? 0 : o.order === 'asc' ? 1 : -1;
            else if (b[o.key] === undefined)
              return a[o.key] === undefined ? 0 : o.order === 'asc' ? -1 : 1;
            return a[o.key] > b[o.key]
              ? o.order === 'asc'
                ? 1
                : -1
              : a[o.key] < b[o.key]
                ? o.order === 'asc'
                  ? -1
                  : 1
                : 0;
          })
          .find(x => x !== 0) || 0
      );
    }
  });
  return ordonnées;
});

const ordonnerPar = ref<{key: string; order: 'asc' | 'desc'}[]>();

// Colonnes
const colonnes = suivre(constl.nuées.suivreColonnesTableauNuée, {
  idNuée: computed(() => props.idNuee),
  clefTableau: computed(() => props.clefTableau),
});

const colonnesAvecCatégories = suivre(constl.nuées.suivreColonnesEtCatégoriesTableauNuée, {
  idNuée: computed(() => props.idNuee),
  clefTableau: computed(() => props.clefTableau),
});

const colonnesVariables = computed(() => {
  return (colonnes.value || []).map(c => {
    const catégorie = colonnesAvecCatégories.value?.find(col => col.id === c.id)?.catégorie;
    return {
      key: c.id,
      sortable:
        catégorie === undefined ||
        (catégorie?.type === 'simple' ? triable(catégorie.catégorie) : false),
      info: {
        index: c.index,
        catégorie,
        variable: c.variable,
      },
    };
  });
});

const entêtes = computed(() => {
  return [
    ...(colonnes.value || []).map(c => ({
      key: c.id,
    })),
    {key: 'idCompte'},
  ];
});

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
  idColonne = await constl.nuées.ajouterColonneTableauNuée({
    idTableau: props.idTableau,
    idVariable,
    idColonne,
  });
  if (index)
    await constl.nuées.changerColIndexTableauNuée({
      idTableau: props.idTableau,
      idColonne,
      val: true,
    });
  for (const règle of règles) {
    await constl.nuées.ajouterRègleTableauNuée({
      idTableau: props.idTableau,
      idColonne,
      règle,
    });
  }
};

const modifierColonne = async ({
  idColonne,
  index,
  // variable,  // à faire
  règles,
}: {
  idColonne: string;
  index: boolean;
  // variable: string;
  règles: {
    nouvelles: valid.règleVariable[];
    àEffacer: string[];
  };
}) => {
  await constl.nuées.changerColIndexTableauNuée({
    idTableau: props.idTableau,
    idColonne,
    val: index,
  });
  for (const r of règles.nouvelles)
    await constl.nuées.ajouterRègleTableauNuée({
      idTableau: props.idTableau,
      idColonne,
      règle: r,
    });
  // await constl.nuées.changerVariableColonne({idTableau: props.idTableau, idColonne, variable})
  for (const r of règles.àEffacer)
    await constl.nuées.effacerRègleTableauNuée({
      idTableau: props.idTableau,
      idRègle: r,
    });
};

const effacerColonne = async ({idColonne}: {idColonne: string}) => {
  await constl.nuées.effacerColonneTableauNuée({
    idTableau: props.idTableau,
    idColonne,
  });
};

// Effacer tableau
const effacerTableau = async () => {
  await constl.nuées.effacerTableauNuée({idNuée: props.idNuee, idTableau: props.idTableau});
};
</script>
