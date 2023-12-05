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
        {{ item.texte }}
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
        <template #activator="{props}">
          <RésultatRechercheBd
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
      <carte-bd
        v-for="r in résultatsRechercheMotsClefs"
        :id="r.id"
        :key="r.id"
      >
        <template #activator="{props}">
          <RésultatRechercheMotClef
            v-bind="props"
            :résultat="r"
          />
        </template>
      </carte-bd>
    </v-list>
    <v-list
      v-else-if="itemsTypesDonnées[typeDonnées].clef === 'variables'"
      class="text-start"
    >
      <carte-bd
        v-for="r in résultatsRechercheVariables"
        :id="r.id"
        :key="r.id"
      >
        <template #activator="{props}">
          <RésultatRechercheVariable
            v-bind="props"
            :résultat="r"
          />
        </template>
      </carte-bd>
    </v-list>
    <v-list
      v-else-if="itemsTypesDonnées[typeDonnées].clef === 'projets'"
      class="text-start"
    >
      <carte-bd
        v-for="r in résultatsRechercheProjets"
        :id="r.id"
        :key="r.id"
      >
        <template #activator="{props}">
          <RésultatRechercheProjet
            v-bind="props"
            :résultat="r"
          />
        </template>
      </carte-bd>
    </v-list>
    <v-list
      v-else-if="itemsTypesDonnées[typeDonnées].clef === 'nuées'"
      class="text-start"
    >
      <carte-bd
        v-for="r in résultatsRechercheNuée"
        :id="r.id"
        :key="r.id"
      >
        <template #activator="{props}">
          <RésultatRechercheNuée
            v-bind="props"
            :résultat="r"
          />
        </template>
      </carte-bd>
      <v-list-item @click="augmenterN">
        <v-list-item-title> t('Augementer N') </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-container>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';
import type {ClientConstellation} from '@constl/ipa';

import {type Ref, watchEffect} from 'vue';

import {inject, ref} from 'vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {MultiChercheur} from '/@/components/utils';
import {utiliserImagesDéco} from '/@/composables/images';

import TitrePage from '../components/communs/TitrePage.vue';
import RésultatRechercheMotClef from '/@/components/recherche/RésultatRechercheMotClef.vue';
import RésultatRechercheBd from '/@/components/recherche/RésultatRechercheBd.vue';
import CarteBd from '/@/components/bds/CarteBd.vue';
import RésultatRechercheVariable from '/@/components/recherche/RésultatRechercheVariable.vue';
import RésultatRechercheProjet from '/@/components/recherche/RésultatRechercheProjet.vue';
import RésultatRechercheNuée from '/@/components/recherche/RésultatRechercheNuée.vue';

const constl = inject<ClientConstellation>('constl');

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

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
    texte: t('pages.mesDonnées.motsClefs'),
    clef: 'motsClefs',
  },
  {
    icône: 'mdi-variable',
    texte: t('pages.mesDonnées.variables'),
    clef: 'variables',
  },
  {
    icône: 'mdi-database-outline',
    texte: t('pages.mesDonnées.bds'),
    clef: 'bds',
  },
  {
    icône: 'mdi-folder-outline',
    texte: t('pages.mesDonnées.projets'),
    clef: 'projets',
  },
  {
    icône: 'mdi-account-group-outline',
    texte: t('pages.mesDonnées.nuées'),
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
        requète: texteRecherche,
        réfRésultat: résultatsRechercheMotsClefs,
        fRecherche: async ({
          requète,
          nOuProfondeur,
          réfRésultat,
        }: {
          requète: string;
          nOuProfondeur: number;
          réfRésultat: Ref<types.résultatRecherche<types.infoRésultatTexte>[]>;
        }) => {
          return await constl?.recherche.rechercherMotsClefsSelonTexte({
            texte: requète,
            f: x => (réfRésultat.value = x),
            nRésultatsDésirés: nOuProfondeur,
          });
        },
      });
      break;
    }
    case 'variables': {
      await chercheur.lancerRecherche({
        requète: texteRecherche,
        réfRésultat: résultatsRechercheVariables,
        fRecherche: async ({
          requète,
          nOuProfondeur,
          réfRésultat,
        }: {
          requète: string;
          nOuProfondeur: number;
          réfRésultat: Ref<types.résultatRecherche<types.infoRésultatTexte>[]>;
        }) => {
          return await constl?.recherche.rechercherVariablesSelonTexte({
            texte: requète,
            f: x => (réfRésultat.value = x),
            nRésultatsDésirés: nOuProfondeur,
          });
        },
      });
      break;
    }
    case 'bds': {
      await chercheur.lancerRecherche({
        requète: texteRecherche,
        réfRésultat: résultatsRechercheBd,
        fRecherche: async ({
          requète,
          nOuProfondeur,
          réfRésultat,
        }: {
          requète: string;
          nOuProfondeur: number;
          réfRésultat: Ref<
            types.résultatRecherche<
              types.infoRésultatTexte | types.infoRésultatRecherche<types.infoRésultatTexte>
            >[]
          >;
        }) => {
          return await constl?.recherche.rechercherBdsSelonTexte({
            texte: requète,
            f: x => (réfRésultat.value = x),
            nRésultatsDésirés: nOuProfondeur,
          });
        },
      });
      break;
    }
    case 'projets': {
      await chercheur.lancerRecherche({
        requète: texteRecherche,
        réfRésultat: résultatsRechercheProjets,
        fRecherche: async ({
          requète,
          nOuProfondeur,
          réfRésultat,
        }: {
          requète: string;
          nOuProfondeur: number;
          réfRésultat: Ref<
            types.résultatRecherche<
              | types.infoRésultatTexte
              | types.infoRésultatRecherche<
                  types.infoRésultatTexte | types.infoRésultatRecherche<types.infoRésultatTexte>
                >
            >[]
          >;
        }) => {
          return await constl?.recherche.rechercherProjetsSelonTexte({
            texte: requète,
            f: x => (réfRésultat.value = x),
            nRésultatsDésirés: nOuProfondeur,
          });
        },
      });
      break;
    }
    case 'nuées': {
      await chercheur.lancerRecherche({
        requète: texteRecherche,
        réfRésultat: résultatsRechercheNuée,
        fRecherche: async ({
          requète,
          nOuProfondeur,
          réfRésultat,
        }: {
          requète: string;
          nOuProfondeur: number;
          réfRésultat: Ref<
            types.résultatRecherche<
              types.infoRésultatTexte | types.infoRésultatRecherche<types.infoRésultatTexte>
            >[]
          >;
        }) => {
          return await constl?.recherche.rechercherNuéesSelonTexte({
            texte: requète,
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