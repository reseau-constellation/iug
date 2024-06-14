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
          :disabled="!nFilesModifiées"
          @click="()=>sauvegarderModifications()"
        >
          <v-badge
            v-if="nFilesModifiées"
            color="success"
            :content="nFilesModifiées"
          >
            <v-icon
              color="primary"
              icon="mdi-content-save-outline"
            />
          </v-badge>
          <v-icon
            v-else
            color="primary"
            icon="mdi-content-save-check-outline"
          />
        </v-btn>
        <v-switch
          v-model="édition"
          :readonly="!autorisation"
          class="me-2"
          density="compact"
          color="primary"
          true-icon="mdi-pencil-outline"
          false-icon="mdi-pencil-off-outline"
          hide-details
        />
        
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

    <template #[`header.actions`]>
      <v-btn
        v-if="plusConfirmer"
        icon="mdi-delete"
        size="small"
        :loading="enEffaçage"
        :readonly="!sélectionnées.length"
        @click="()=>effacerSélectionnées()"
      />
      <v-dialog
        v-else
        v-model="dialogueEffacerSélectionnées"
      >
        <template #activator="{props: propsActivateur}">
          <v-btn
            v-bind="propsActivateur"
            icon
            variant="flat"
            size="small"
            :readonly="!sélectionnées.length"
            :loading="enEffaçage"
          >
            <v-icon
              icon="mdi-delete"
              :color="sélectionnées.length ? undefined : 'disabled'"
            />
          </v-btn>
        </template>
        <v-card
          class="mx-auto"
          max-width="450"
        >
          <v-card-item>
            <v-card-title>
              {{ t('tableaux.données.titreEffacerSélectionnées', sélectionnées.length) }}
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
              @click="()=>{effacerSélectionnées(); dialogueEffacerSélectionnées = false}"
            />
            <v-btn
              variant="text"
              color="primary"
              :text="t('communs.non')"
              @click="dialogueEffacerSélectionnées = false"
            />
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <template
      v-for="c in colonnesVariables"
      :key="c.key"
      #[`item.${c.key}`]="{item}"
    >
      <cellule-tableau
        :categorie="c.info.catégorie?.catégorie"
        :val="item.données[c.key]"
        :editable="!!autorisation && édition"
        @modifiee="({val}) => celluleModifiée({idCol: c.key, idÉlément: item.id, val})"
      />
    </template>

    <template #[`item.actions`]="{ item }">
      <v-btn
        v-if="item.id === '-1'"
        :disabled="!valeursÀAjouter"
        icon="mdi-content-save-outline"
        size="small"
        variant="flat"
        @click="()=>ajouterLigne()"
      />
      <v-btn
        v-else-if="plusConfirmer"
        size="small"
        icon="mdi-delete"
        variant="flat"
        :loading="enEffaçage"
        @click="()=>effacerÉlément({idÉlément: item.id})"
      />
      <v-dialog
        v-else
        v-model="dialogueEffacer"
      >
        <template #activator="{props: propsActivateur}">
          <v-btn
            v-bind="propsActivateur"
            variant="flat"
            icon="mdi-delete"
            size="small"
            :loading="enEffaçage"
          />
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

import CelluleTableau from './cellules/CelluleTableau.vue';
import CarteEffacer from '/@/components/communs/CarteEffacer.vue';
import { watchEffect } from 'vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = constellation();
const props = defineProps<{idTableau: string; idBd: string}>();

// Autorisation
const autorisation = suivre(constl.suivrePermission, {idObjet: props.idTableau});

// Variables
const variables = suivre(constl.tableaux.suivreVariables, {idTableau: props.idTableau});

// Colonnes
const colonnes = suivre(constl.tableaux.suivreColonnesTableau<tableaux.InfoCol>, {
  idTableau: props.idTableau,
});
const colonnesAvecCatégories = suivre(constl.tableaux.suivreColonnesTableau<tableaux.InfoColAvecCatégorie>, {
  idTableau: props.idTableau,
  catégories: true,
});

const colonnesVariables = computed(() => {
  return (colonnes.value || []).map(c => {
    const catégorie = colonnesAvecCatégories.value?.find(col => col.id === c.id)?.catégorie;
    return {
      key: c.id,
      sortable: catégorie === undefined || ( catégorie?.type === 'simple' ? triable(catégorie.catégorie) : false),
      info: {
        index: c.index,
        catégorie,
        variable: c.variable,
      },
    };
  });
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
  const ordonnées = données.value?.toSorted((a, b) => {
    if (!ordonnerPar.value) return 0;
    else {
      return ordonnerPar.value.map(o => {
        return a.données[o.key] > b.données[o.key] ? (o.order === 'asc' ? 1 : -1) : (a.données[o.key] < b.données[o.key] ? (o.order === 'asc' ? -1 : 1) : 0);
      }).find(x=>x !== 0) || 0;
    }
  });

  const nouvelleFile: tableaux.élémentDonnées<tableaux.élémentBdListeDonnées> = {
    id: '-1',
    données: {},
  };
  return (édition.value && ordonnées) ? [nouvelleFile, ...ordonnées] : ordonnées;
});

const ordonnerPar = ref<{key: string, order: 'asc' | 'desc'}[]>();

// Sélection files
const sélectionnées = ref<string[]>([]);


// Règles
const règles = suivre(constl.tableaux.suivreRègles, {idTableau: props.idTableau});

// Modification valeurs
const édition = ref(false);

const modifsEnCours = ref(false);
const modifications = ref<{[idÉlément: string]: {[idCol: string]: types.élémentsBd | undefined}}>();
const modificationsDéfinitives = computed<{idÉlément: string, vals: {[idCol: string]: types.élémentsBd | undefined}}[]>(()=>{
  const définitives: {idÉlément: string, vals: {[idCol: string]: types.élémentsBd | undefined}}[] = [];
  for (const [idÉlément, modifsÉlément] of Object.entries(modifications.value || {})) {
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
const nFilesModifiées = computed(()=>{
  return modificationsDéfinitives.value.length + (Object.keys(nouvelleLigne.value).length ? 1 : 0);
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

const nouvelleLigne = ref<{[idCol: string]: types.élémentsBd}>({});
watchEffect(()=>{
  if (!édition.value) nouvelleLigne.value = {};
});
const valeursÀAjouter = computed(()=>{
  return Object.keys(nouvelleLigne.value).length > 0;
});

const celluleModifiée = ({val, idCol, idÉlément}: {val: types.élémentsBd | undefined, idCol: string, idÉlément: string}) => {
  if (idÉlément === '-1') {
    if (val !== undefined) nouvelleLigne.value[idCol] = val;
    else delete nouvelleLigne.value[idCol];
  } else {
    const modifs = modifications.value || {};
    if (!modifs[idÉlément]) modifs[idÉlément] = {};
    modifs[idÉlément][idCol] = val;
    modifications.value = modifs;
  }
};

const sauvegarderModifications = async () => {
  modifsEnCours.value = true;
  
  for (const {idÉlément, vals} of modificationsDéfinitives.value) {
    await constl.tableaux.modifierÉlément({ idTableau: props.idTableau, idÉlément, vals});
  }
  if (valeursÀAjouter.value) await ajouterLigne();
  modifications.value = undefined;
  modifsEnCours.value = false;
};


const ajouterLigne = async () => {
  await constl.tableaux.ajouterÉlément({
    idTableau: props.idTableau,
    vals: nouvelleLigne.value,
  });
  nouvelleLigne.value = {};
};


// Effacer données
const plusConfirmer = ref(false);
const choixPlusConfirmer = ref(false);
const enEffaçage = ref(false);

const dialogueEffacer = ref(false);
const dialogueEffacerSélectionnées = ref(false);

watch([dialogueEffacer, dialogueEffacerSélectionnées], ()=>{
  // Il faut faire ça ici, car sinon on désactive le dialogue en cliquant sur l'option "Ne plus me demander"
  plusConfirmer.value = choixPlusConfirmer.value;
});

const effacerÉlément = async ({idÉlément}: {idÉlément: string}) => {
  enEffaçage.value = true;
  await constl.tableaux.effacerÉlément({ idTableau: props.idTableau, idÉlément });
  enEffaçage.value = false;
};

const effacerSélectionnées = async () => {
  enEffaçage.value = true;
  await Promise.all(sélectionnées.value.map(idÉlément=>effacerÉlément({idÉlément})));
  sélectionnées.value = [];
  enEffaçage.value = false;
};


// Effacer tableau
const effacerTableau = async () => {
  await constl.bds.effacerTableauBd({idBd: props.idBd, idTableau: props.idTableau});
};

</script>
