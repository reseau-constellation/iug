<template>
  <v-container class="text-center">
    <TitrePage
      :titre="t('pages.recherche.titre')"
      :image="imageTitre"
    />
    <v-text-field
      v-model="texteRecherche"
      variant="outlined"
      prepend-inner-icon="mdi-magnify"
      clearable
    />
    <v-chip-group
      v-model="typeDonnées"
      color="primary"
      mandatory
    >
      <v-chip
        v-for="item in itemsTypesDonnées"
        :key="item.clef"
        class="mx-2"
        variant="outlined"
        :prepend-icon="item.icône"
      >
        {{ t(item.texte) }}
      </v-chip>
    </v-chip-group>
    <v-list
      v-if="itemsTypesDonnées[typeDonnées].clef === 'bds'"
      class="text-start"
    >
      <carte-bd
        v-for="r in résultatsRechercheBd"
        :id="r.id"
        :key="r.id"
      >
        <template #activateur="{props}">
          <resultat-recherche-bd
            v-bind="props"
            :résultat="r"
          />
        </template>
      </carte-bd>
    </v-list>
    <v-list
      v-else-if="itemsTypesDonnées[typeDonnées].clef === 'motsClefs'"
      class="text-start"
    >
      <carte-mot-clef
        v-for="r in résultatsRechercheMotsClefs"
        :id="r.id"
        :key="r.id"
      >
        <template #activateur="{props}">
          <resultat-recherche-mot-clef
            v-bind="props"
            :résultat="r"
          />
        </template>
      </carte-mot-clef>
    </v-list>
    <v-list
      v-else-if="itemsTypesDonnées[typeDonnées].clef === 'variables'"
      class="text-start"
    >
      <carte-variable
        v-for="r in résultatsRechercheVariables"
        :id="r.id"
        :key="r.id"
      >
        <template #activator="{props}">
          <resultat-recherche-variable
            v-bind="props"
            :résultat="r"
          />
        </template>
      </carte-variable>
    </v-list>
    <v-list
      v-else-if="itemsTypesDonnées[typeDonnées].clef === 'projets'"
      class="text-start"
    >
      <carte-projet
        v-for="r in résultatsRechercheProjets"
        :id="r.id"
        :key="r.id"
      >
        <template #activateur="{props}">
          <resultat-recherche-projet
            v-bind="props"
            :résultat="r"
          />
        </template>
      </carte-projet>
    </v-list>
    <v-list
      v-else-if="itemsTypesDonnées[typeDonnées].clef === 'nuées'"
      class="text-start"
    >
      <carte-nuee
        v-for="r in résultatsRechercheNuée"
        :id="r.id"
        :key="r.id"
      >
        <template #activateur="{props}">
          <resultat-recherche-nuee
            v-bind="props"
            :résultat="r"
          />
        </template>
      </carte-nuee>
      <v-list-item @click="augmenterN">
        <v-list-item-title> t('Augementer N') </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-container>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import {type Ref, watchEffect} from 'vue';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ref} from 'vue';
import {MultiChercheur, utiliserConstellation} from '/@/components/utils';
import {utiliserImagesDéco} from '/@/composables/images';

import TitrePage from '../components/communs/TitrePage.vue';
import CarteBd from '/@/components/bds/CarteBd.vue';
import CarteMotClef from '/@/components/motsClefs/CarteMotClef.vue';
import CarteNuee from '/@/components/nuées/CarteNuée.vue';
import CarteProjet from '/@/components/projets/CarteProjet.vue';
import CarteVariable from '/@/components/variables/CarteVariable.vue';
import ResultatRechercheBd from '/@/components/recherche/RésultatRechercheBd.vue';
import ResultatRechercheMotClef from '/@/components/recherche/RésultatRechercheMotClef.vue';
import ResultatRechercheNuee from '/@/components/recherche/RésultatRechercheNuée.vue';
import ResultatRechercheProjet from '/@/components/recherche/RésultatRechercheProjet.vue';
import ResultatRechercheVariable from '/@/components/recherche/RésultatRechercheVariable.vue';

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const {obtImageDéco} = utiliserImagesDéco();
const imageTitre = obtImageDéco('recherche');

// Options de recherche
const texteRecherche = ref<string>();

const typeDonnées = ref(2);
const itemsTypesDonnées: {
  icône: string;
  texte: string;
  clef: 'motsClefs' | 'variables' | 'bds' | 'projets' | 'nuées';
}[] = [
  {
    icône: 'mdi-key',
    texte: 'pages.mesDonnées.motsClefs',
    clef: 'motsClefs',
  },
  {
    icône: 'mdi-variable',
    texte: 'pages.mesDonnées.variables',
    clef: 'variables',
  },
  {
    icône: 'mdi-database-outline',
    texte: 'pages.mesDonnées.bds',
    clef: 'bds',
  },
  {
    icône: 'mdi-folder-outline',
    texte: 'pages.mesDonnées.projets',
    clef: 'projets',
  },
  {
    icône: 'mdi-account-group-outline',
    texte: 'pages.mesDonnées.nuées',
    clef: 'nuées',
  },
];

const résultatsRechercheBd =
  ref<
    types.résultatRecherche<
      types.infoRésultatTexte | types.infoRésultatRecherche<types.infoRésultatTexte>
    >[]
  >();
const résultatsRechercheMotsClefs = ref<types.résultatRecherche<types.infoRésultatTexte>[]>();
const résultatsRechercheVariables = ref<types.résultatRecherche<types.infoRésultatTexte>[]>();
const résultatsRechercheProjets =
  ref<
    types.résultatRecherche<
      | types.infoRésultatTexte
      | types.infoRésultatRecherche<
          types.infoRésultatTexte | types.infoRésultatRecherche<types.infoRésultatTexte>
        >
    >[]
  >();
const résultatsRechercheNuée =
  ref<
    types.résultatRecherche<
      types.infoRésultatTexte | types.infoRésultatRecherche<types.infoRésultatTexte>
    >[]
  >();

const chercheur = new MultiChercheur();
const {nOuProfondeur} = chercheur;

const augmenterN = () => {
  nOuProfondeur.value++;
};

watchEffect(async () => {
  const étiquetteTypeDonnées = itemsTypesDonnées[typeDonnées.value].clef;

  switch (étiquetteTypeDonnées) {
    case 'motsClefs': {
      await chercheur.lancerRecherche({
        requête: texteRecherche,
        réfRésultat: résultatsRechercheMotsClefs,
        fRecherche: async ({
          requête,
          nOuProfondeur,
          réfRésultat,
        }: {
          requête: string;
          nOuProfondeur: number;
          réfRésultat: Ref<
            types.résultatRecherche<types.infoRésultatTexte | types.infoRésultatVide>[]
          >;
        }) => {
          return await constl.recherche.rechercherMotsClefsSelonTexte({
            texte: requête,
            f: x => (réfRésultat.value = x),
            nRésultatsDésirés: nOuProfondeur,
          });
        },
      });
      break;
    }
    case 'variables': {
      await chercheur.lancerRecherche({
        requête: texteRecherche,
        réfRésultat: résultatsRechercheVariables,
        fRecherche: async ({
          requête,
          nOuProfondeur,
          réfRésultat,
        }: {
          requête: string;
          nOuProfondeur: number;
          réfRésultat: Ref<
            types.résultatRecherche<types.infoRésultatTexte | types.infoRésultatVide>[]
          >;
        }) => {
          return await constl.recherche.rechercherVariablesSelonTexte({
            texte: requête,
            f: x => (réfRésultat.value = x),
            nRésultatsDésirés: nOuProfondeur,
          });
        },
      });
      break;
    }
    case 'bds': {
      await chercheur.lancerRecherche({
        requête: texteRecherche,
        réfRésultat: résultatsRechercheBd,
        fRecherche: async ({
          requête,
          nOuProfondeur,
          réfRésultat,
        }: {
          requête: string;
          nOuProfondeur: number;
          réfRésultat: Ref<
            types.résultatRecherche<
              | types.infoRésultatTexte
              | types.infoRésultatRecherche<types.infoRésultatTexte | types.infoRésultatVide>
              | types.infoRésultatVide
            >[]
          >;
        }) => {
          return await constl.recherche.rechercherBdsSelonTexte({
            texte: requête,
            f: x => (réfRésultat.value = x),
            nRésultatsDésirés: nOuProfondeur,
          });
        },
      });
      break;
    }
    case 'projets': {
      await chercheur.lancerRecherche({
        requête: texteRecherche,
        réfRésultat: résultatsRechercheProjets,
        fRecherche: async ({
          requête,
          nOuProfondeur,
          réfRésultat,
        }: {
          requête: string;
          nOuProfondeur: number;
          réfRésultat: Ref<
            types.résultatRecherche<
              | types.infoRésultatTexte
              | types.infoRésultatRecherche<
                  | types.infoRésultatTexte
                  | types.infoRésultatRecherche<types.infoRésultatTexte | types.infoRésultatVide>
                  | types.infoRésultatVide
                >
              | types.infoRésultatVide
            >[]
          >;
        }) => {
          return await constl.recherche.rechercherProjetsSelonTexte({
            texte: requête,
            f: x => (réfRésultat.value = x),
            nRésultatsDésirés: nOuProfondeur,
          });
        },
      });
      break;
    }
    case 'nuées': {
      await chercheur.lancerRecherche({
        requête: texteRecherche,
        réfRésultat: résultatsRechercheNuée,
        fRecherche: async ({
          requête,
          nOuProfondeur,
          réfRésultat,
        }: {
          requête: string;
          nOuProfondeur: number;
          réfRésultat: Ref<
            types.résultatRecherche<
              | types.infoRésultatTexte
              | types.infoRésultatRecherche<types.infoRésultatTexte | types.infoRésultatVide>
              | types.infoRésultatVide
            >[]
          >;
        }) => {
          return await constl.recherche.rechercherNuéesSelonTexte({
            texte: requête,
            f: x => (réfRésultat.value = x),
            nRésultatsDésirés: nOuProfondeur,
          });
        },
      });
      break;
    }
    default:
      break;
  }
});
</script>
