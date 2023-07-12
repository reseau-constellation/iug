<template>
  <p class="mb-0 text-overline">
    {{ t('bd.visBD.தகவல்கள்') }}
    <nouvelle-colonne :id-tableau="idTableau">
      <template #activator="{props: propsActivateur}">
        <v-btn
          v-bind="propsActivateur"
          icon="mdi-table-column-plus-after"
          size="small"
          :disabled="!monAutorisation"
        />
      </template>
    </nouvelle-colonne>
    <NouvelleLigne @sauvegarder="x => ajouterÉlément(x)">
      <template #activator="{props: propsActivateur}">
        <v-btn
          v-bind="propsActivateur"
          icon="mdi-table-row-plus-after"
          size="small"
          inset
          :disabled="!monAutorisation || !colonnes || !colonnes.length"
        />
      </template>
    </NouvelleLigne>
    <v-switch
      v-model="éditer"
      :disabled="!monAutorisation || !colonnes || !colonnes.length"
      true-icon="mdi-pencil"
      false-icon="mdi-pencil-off"
      :color="éditer ? 'primary' : 'secondary'"
    />
    <v-btn
      v-if="éditer"
      :disabled="!filesSélectionnées.length"
      color="error"
      @click="effacer"
    >
    </v-btn>
  </p>

  <v-data-table
    v-if="colonnes && éléments"
    v-model="filesSélectionnées"
    :headers="entêtes"
    :items="éléments"
    :show-select="éditer"
    density="compact"
  >
    <template #no-data>
      <div class="text-center my-3">
        <p class="text-h5 mt-5">{{ t('tableau.vide') }}</p>
        <div v-if="monAutorisation">
          <nouvelle-colonne :id-tableau="idTableau">
            <template #activator="{props: propsActivateur}">
              <v-btn
                v-bind="propsActivateur"
                color="primary"
                class="mx-2"
                variant="outlined"
                icon="mdi-table-column-plus-after"
              >
                {{ t('tableau.ajouterColonne') }}
              </v-btn>
            </template>
          </nouvelle-colonne>
          <NouvelleLigne @sauvegarder="x => ajouterÉlément(x)">
            <template #activator="{props: propsActivateur}">
              <v-btn
                v-if="colonnes.length"
                v-bind="propsActivateur"
                color="primary"
                class="mx-2"
                variant="outlined"
                icon="mdi-table-row-plus-after"
                label
              >
                {{ t('tableau.ajouterFile') }}
              </v-btn>
            </template>
          </NouvelleLigne>
          <v-btn>
            {{ t('tableau.importerDonnées') }}
          </v-btn>
        </div>
      </div>
    </template>

    <template
      v-for="c in entêtes"
      :key="c.key"
      #[`column.${c.key}`]="{column}"
    >
      <EntêteColonneTableau
        v-if="c.key !== 'actions'"
        :permission-modifier="monAutorisation"
        :id-variable="column.title"
        :id-colonne="column.value"
        :id-tableau="idTableau"
        :index="c.index"
      >
        <template #activator="{props: propsActivateur}">
          <span v-bind="propsActivateur">{{ c.title }}</span>
        </template>
      </EntêteColonneTableau>
      <span v-else>
        {{ c.title }}
      </span>
    </template>
    <template
      v-for="c in entêtes"
      :key="c.key"
      #[`item.${c.key}`]="{item}"
    >
      <span v-if="c.key === 'actions'">
        <v-btn
          color="error"
          icon
          small
          @click="() => effacerÉlément(item.raw.empreinte)"
        >
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </span>
      <cellule-liste
        v-else-if="c.info.catégorie?.type === 'liste'"
        :val="item.columns[c.key]"
        :editer="éditer"
        :erreurs="erreursValidation?.filter(x => x.erreur.règle.colonne === c.key)"
        @changer-valeur="
          (x: utils.élémentsBd[]) =>
            modifierÉlément({empreinte: item.raw.empreinte, col: c.key, val: x})
        "
      />
      <CelluleChaîneNonTraductible
        v-else-if="c.info.catégorie?.catégorie === 'chaîneNonTraductible'"
        :val="item.columns[c.key]"
        :editer="éditer"
        :erreurs="erreursValidation?.filter(x => x.erreur.règle.colonne === c.key)"
        @changer-valeur="
          (x: string) => modifierÉlément({empreinte: item.raw.empreinte, col: c.key, val: x})
        "
      />
      <CelluleNumérique
        v-else-if="c.info.catégorie?.catégorie === 'numérique'"
        :val="item.columns[c.key]"
        :editer="éditer"
        :erreurs="erreursValidation?.filter(x => x.erreur.règle.colonne === c.key)"
        @changer-valeur="
          (x: number) => modifierÉlément({empreinte: item.raw.empreinte, col: c.key, val: x})
        "
      />
      <CelluleHoroDatage
        v-else-if="c.info.catégorie?.catégorie === 'horoDatage'"
        :val="item.columns[c.key]"
        :editer="éditer"
        :erreurs="erreursValidation?.filter(x => x.erreur.règle.colonne === c.key)"
        @changer-valeur="
          (x: number) => modifierÉlément({empreinte: item.raw.empreinte, col: c.key, val: x})
        "
      />
      <CelluleIntervaleTemps
        v-else-if="c.info.catégorie?.catégorie === 'intervaleTemps'"
        :val="item.columns[c.key]"
        :editer="éditer"
        :erreurs="erreursValidation?.filter(x => x.erreur.règle.colonne === c.key)"
        @changer-valeur="
          (x: number) => modifierÉlément({empreinte: item.raw.empreinte, col: c.key, val: x})
        "
      />
      <CelluleBooléenne
        v-else-if="c.info.catégorie?.catégorie === 'booléen'"
        :val="item.columns[c.key]"
        :editer="éditer"
        :erreurs="erreursValidation?.filter(x => x.erreur.règle.colonne === c.key)"
        @changer-valeur="
          (x: number) => modifierÉlément({empreinte: item.raw.empreinte, col: c.key, val: x})
        "
      />
      <celluleChaîne
        v-else-if="c.info.catégorie?.catégorie === 'chaîne'"
        :val="item.columns[c.key]"
        :editer="éditer"
        :erreurs="erreursValidation?.filter(x => x.erreur.règle.colonne === c.key)"
        @changer-valeur="
          (x: number) => modifierÉlément({empreinte: item.raw.empreinte, col: c.key, val: x})
        "
      />

      <celluleGéoJSON
        v-else-if="c.info.catégorie?.catégorie === 'géojson'"
        :val="item.columns[c.key]"
        :editer="éditer"
        :erreurs="erreursValidation?.filter(x => x.erreur.règle.colonne === c.key)"
        @changer-valeur="
          (x: number) => modifierÉlément({empreinte: item.raw.empreinte, col: c.key, val: x})
        "
      />
      <CelluleVidéo
        v-else-if="c.info.catégorie?.catégorie === 'vidéo'"
        :val="item.columns[c.key]"
        :editer="éditer"
        :erreurs="erreursValidation?.filter(x => x.erreur.règle.colonne === c.key)"
        @changer-valeur="
          (x: number) => modifierÉlément({empreinte: item.raw.empreinte, col: c.key, val: x})
        "
      />
      <CelluleAudio
        v-else-if="c.info.catégorie?.catégorie === 'audio'"
        :val="item.columns[c.key]"
        :editer="éditer"
        :erreurs="erreursValidation?.filter(x => x.erreur.règle.colonne === c.key)"
        @changer-valeur="
          (x: number) => modifierÉlément({empreinte: item.raw.empreinte, col: c.key, val: x})
        "
      />
      <CelluleImage
        v-else-if="c.info.catégorie?.catégorie === 'image'"
        :val="item.columns[c.key]"
        :editer="éditer"
        :erreurs="erreursValidation?.filter(x => x.erreur.règle.colonne === c.key)"
        @changer-valeur="
          (x: number) => modifierÉlément({empreinte: item.raw.empreinte, col: c.key, val: x})
        "
      />
      <CelluleFichier
        v-else-if="c.info.catégorie?.catégorie === 'fichier'"
        :val="item.columns[c.key]"
        :editer="éditer"
        :erreurs="erreursValidation?.filter(x => x.erreur.règle.colonne === c.key)"
        @changer-valeur="
          (x: number) => modifierÉlément({empreinte: item.raw.empreinte, col: c.key, val: x})
        "
      />
    </template>
  </v-data-table>

  <v-skeleton-loader
    v-else
    type="image"
  />
</template>
<script setup lang="ts">
import type {client, tableaux, variables, valid, utils} from '@constl/ipa';

import {ref, inject, computed} from 'vue';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {enregistrerÉcoute} from '../utils';

import {VDataTable} from 'vuetify/labs/VDataTable';
import {VSkeletonLoader} from 'vuetify/labs/VSkeletonLoader';

import NouvelleColonne from './NouvelleColonne.vue';
import NouvelleLigne from './NouvelleLigne.vue';

import CelluleChaîneNonTraductible from './cellules/CelluleChaîneNonTraductible.vue';
import CelluleBooléenne from './cellules/CelluleBooléenne.vue';
import CelluleNumérique from './cellules/CelluleNumérique.vue';

const props = defineProps<{idTableau: string}>();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Contrôles
const éditer = ref(false);

// Autorisation
const monAutorisation = ref<'MODÉRATEUR' | 'MEMBRE' | undefined>();
enregistrerÉcoute(
  constl?.suivrePermission({
    idObjet: props.idTableau,
    f: x => (monAutorisation.value = x),
  }),
);

// Colonnes du tableau
const colonnes = ref<tableaux.InfoColAvecCatégorie[]>();
enregistrerÉcoute(
  constl?.tableaux?.suivreColonnes({
    idTableau: props.idTableau,
    f: x => (colonnes.value = x),
  }),
);

// Entêtes
const entêtes = computed(() => {
  return colonnes.value?.map(c => {
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

// Éléments
const éléments = ref<valid.élémentDonnées<tableaux.élémentBdListeDonnées>[]>();
const filesSélectionnées = ref<string[]>([]);
enregistrerÉcoute(
  constl?.tableaux?.suivreDonnées({
    idTableau: props.idTableau,
    f: x => (éléments.value = x),
  }),
);
const ajouterÉlément = async (vals: {[idCol: string]: tableaux.élémentBdListeDonnées}) => {
  await constl?.tableaux?.ajouterÉlément({
    idTableau: props.idTableau,
    vals,
  });
};
const effacerÉlément = async (empreinte: string) => {
  await constl?.tableaux?.effacerÉlément({
    idTableau: props.idTableau,
    empreinteÉlément: empreinte,
  });
};
const effacer = async () => {
  await Promise.all(filesSélectionnées.value.map(effacerÉlément));
};

const modifierÉlément = async ({
  col,
  val,
  empreinte,
}: {
  col: string;
  val: utils.élémentsBd;
  empreinte: string;
}) => {
  await constl?.tableaux?.modifierÉlément({
    idTableau: props.idTableau,
    vals: {[col]: val},
    empreintePrécédente: empreinte,
  });
};

// Validation
const erreursValidation = ref<valid.erreurValidation[]>();
enregistrerÉcoute(
  constl?.tableaux?.suivreValidDonnées({
    idTableau: props.idTableau,
    f: x => (erreursValidation.value = x),
  }),
);
</script>
