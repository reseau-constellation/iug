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
        <v-btn
          icon
          :disabled="!modificationsDéfinitives.length"
          @click="()=>sauvegarderModifications()"
        >
          <v-badge
            v-if="modificationsDéfinitives.length"
            color="success"
            :content="modificationsDéfinitives.length"
          >
            <v-icon
              color="primary"
              icon="mdi-content-save-outline"
            />
          </v-badge>
          <v-icon
            v-else
            color="primary"
            icon="mdi-content-save-outline"
          />
        </v-btn>
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
        <carte-effacer
          v-if="autorisation"
          @effacer="() => effacerTableau()"
        >
          <template #activator="{props: propsActivateur}">
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
      v-for="c in colonnesVariables || []"
      :key="c.key"
      #[`header.${c.key}`]="{column, isSorted, getSortIcon, toggleSort}"
    >
      <entete-colonne-tableau
        :id-colonne="c.key"
        :id-variable="c.info.variable"
        :id-tableau="idTableau"
        :index="!!c.info.index"
        :regles="règles?.filter(r=>r.colonne === c.key)"
        :permission-modifier="!!autorisation"
        :ordonnable="column.sortable"
        :est-ordonnee="isSorted(column)"
        :icone-ordonner="getSortIcon(column) as string"
        @basculer-ordonner="() => toggleSort(column)"
      />
    </template>

    <template
      v-for="c in colonnesVariables"
      :key="c.key"
      #[`item.${c.key}`]="{item}"
    >
      <cellule-tableau
        :categorie="c.info.catégorie?.catégorie"
        :val="item.données[c.key]"
        :editable="!!autorisation"
        @modifiee="({val}) => celluleModifiée({idCol: c.key, idÉlément: item.id, val})"
      />
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon
        v-if="plusConfirmer"
        size="small"
        @click="()=>effacerÉlément({idÉlément: item.id})"
      >
        mdi-delete
      </v-icon>
      <v-dialog
        v-else
        v-model="dialogueEffacer"
      >
        <template #activator="{props: propsActivateur}">
          <v-icon
            v-bind="propsActivateur"
            size="small"
          >
            mdi-delete
          </v-icon>
        </template>
        <v-card
          class="mx-auto"
          max-width="450"
        >
          <v-card-item>
            <v-card-title>
              {{ t('tableaux.données.titreEffacer') }}
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <v-checkbox
              v-model="choixPlusConfirmer"
              :label="t('tableaux.données.nePlusConfirmerEffacer')"
            ></v-checkbox>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              variant="text"
              :text="t('communs.oui')"
              @click="()=>{effacerÉlément({idÉlément: item.id}); dialogueEffacer = false}"
            />
            <v-btn
              variant="text"
              color="primary"
              :text="t('communs.non')"
              @click="dialogueEffacer = false"
            />
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-data-table>
</template>
<script setup lang="ts">
import type {tableaux, valid, variables as typesVariables, types} from '@constl/ipa';

import {computed, ref, watch} from 'vue';
import {constellation, suivre} from '../utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import EnteteColonneTableau from './EntêteColonneTableau.vue';
import NouvelleImportation from '/@/components/automatisations/NouvelleImportation.vue';
import NouvelleColonne from './NouvelleColonne.vue';
import NouvelleLigne from './NouvelleLigne.vue';
import CelluleTableau from './cellules/CelluleTableau.vue';
import CarteEffacer from '/@/components/communs/CarteEffacer.vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = constellation();
const props = defineProps<{idTableau: string; idBd: string}>();

// Autorisation
const autorisation = suivre(constl.suivrePermission, {idObjet: props.idTableau});

// Variables
const variables = suivre(constl.tableaux.suivreVariables, {idTableau: props.idTableau});

// Colonnes
const colonnes = suivre(constl.tableaux.suivreColonnesTableau<tableaux.InfoColAvecCatégorie>, {
  idTableau: props.idTableau,
  catégories: true,
});

const colonnesVariables = computed(() => {
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

const entêtes = computed(() => {
  const colonneActions = {
    key: 'actions',
    sortable: false,
    info: {},
  };
  return [...colonnesVariables.value, colonneActions];
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

// Modification valeurs
const modifsEnCours = ref(false);
const modifications = ref<{[idÉlément: string]: {[idCol: string]: types.élémentsBd | undefined}}>({});
const modificationsDéfinitives = computed<{idÉlément: string, vals: {[idCol: string]: types.élémentsBd | undefined}}[]>(()=>{
  const définitives: {idÉlément: string, vals: {[idCol: string]: types.élémentsBd | undefined}}[] = [];
  for (const [idÉlément, modifsÉlément] of Object.entries(modifications.value)) {
    const élémentExistant = données.value?.find(d=>d.id === idÉlément);
    if (!élémentExistant) continue;  // Ne devrait pas arriver
    if (différence({modifs: modifsÉlément, original: élémentExistant.données})) {
      définitives.push({
        idÉlément,
        vals: modifsÉlément,
      });
    }
  }
  return définitives;
});

const différence = ({modifs, original}: {modifs:  {
    [idCol: string]: types.élémentsBd | undefined;
}, original:  {
    [idCol: string]: types.élémentsBd | undefined;
}}): boolean =>  {
  return Object.keys(modifs).some((idCol) => {
    return original[idCol] !== modifs[idCol];
  });
};

const celluleModifiée = ({val, idCol, idÉlément}: {val: types.élémentsBd | undefined, idCol: string, idÉlément: string}) => {
  const modifs = modifications.value;
  if (!modifs[idÉlément]) modifs[idÉlément] = {};
  modifs[idÉlément][idCol] === val;
  modifications.value = modifs;
};

const sauvegarderModifications = async () => {
  modifsEnCours.value = true;
  
  for (const {idÉlément, vals} of modificationsDéfinitives.value) {
    await constl.tableaux.modifierÉlément({ idTableau: props.idTableau, idÉlément, vals});
  }
  modifications.value = {};
  modifsEnCours.value = false;
};

const effacerÉlément = async ({idÉlément}: {idÉlément: string}) => {
  return await constl.tableaux.effacerÉlément({ idTableau: props.idTableau, idÉlément });
};

// Effacer
const plusConfirmer = ref(false);
const choixPlusConfirmer = ref(false);
const dialogueEffacer = ref(false);
const effacerTableau = async () => {
  await constl.bds.effacerTableauBd({idBd: props.idBd, idTableau: props.idTableau});
};
watch(dialogueEffacer, ()=>{
  // Il faut faire ça ici, car sinon on désactive le dialogue en cliquant sur l'option "Ne plus me demander"
  plusConfirmer.value = choixPlusConfirmer.value;
});
</script>
