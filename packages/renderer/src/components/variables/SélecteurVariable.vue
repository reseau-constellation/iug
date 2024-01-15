<template>
  <v-autocomplete
    v-model="variableChoisie"
    v-model:search="recherche"
    :items="résultatsRecherche?.filter(x => !(interdites || []).includes(x.id))"
    variant="outlined"
    @update:model-value="x => sélectionnée(x)"
  >
    <template #item="{item, props: propsItem}">
      <ResultatRechercheVariable
        v-bind="propsItem"
        :résultat="item.raw"
      />
    </template>
    <template #selection="{item}">
      <jeton-variable :id="item.raw.id" />
    </template>
    <template #append>
      <NouvelleVariable>
        <template #activator="{props: propsActivateur}">
          <v-btn
            v-bind="propsActivateur"
            icon="mdi-plus"
            variant="flat"
          />
        </template>
      </NouvelleVariable>
    </template>
    <template #no-data>
      <NouvelleVariable>
        <template #activator="{props: propsActivateur}">
          <v-list-item
            v-bind="propsActivateur"
            prepend-icon="mdi-plus"
            :title="t('variables.sélecteur.aucuneRetrouvée')"
            :subtitle="t('variables.sélecteur.nouvelle')"
          />
        </template>
      </NouvelleVariable>
    </template>
  </v-autocomplete>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import {ref} from 'vue';
import JetonVariable from './JetonVariable.vue';
import {constellation, enregistrerRecherche} from '/@/components/utils';
import ResultatRechercheVariable from '/@/components/recherche/RésultatRechercheVariable.vue';
import NouvelleVariable from './NouvelleVariable.vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

defineProps<{interdites?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idVar: string): void;
}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

// Recherche
const variableChoisie = ref<string>();
const recherche = ref<string>();
const résultatsRecherche = ref<types.résultatRecherche<types.infoRésultatTexte>[]>();

enregistrerRecherche({
  requète: recherche,
  réfRésultat: résultatsRecherche,
  fRecherche: async ({requète, nOuProfondeur, réfRésultat}) =>
    await constl.recherche.rechercherVariablesSelonTexte({
      texte: requète,
      f: x => (réfRésultat.value = x),
      nRésultatsDésirés: nOuProfondeur,
    }),
  fRechercheDéfaut: async ({nOuProfondeur, réfRésultat}) => {
    return await constl.recherche.rechercherVariables({
      f: x => (réfRésultat.value = x),
      nRésultatsDésirés: nOuProfondeur,
    });
  },
});

const sélectionnée = (idVar: string) => {
  émettre('selectionnee', idVar);
};
</script>
