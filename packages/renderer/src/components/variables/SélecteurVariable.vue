<template>
  <v-autocomplete
    v-model="variableChoisie"
    v-model:search="recherche"
    :items="résultatsRecherche?.filter(x => !(interdites || []).includes(x.id))"
    @update:model-value="x => sélectionnée(x)"
  >
    <template #item="{item}">
      <RésultatRechercheVariable :résultat="item.raw" />
    </template>
    <template #selection="{item}">
      <jeton-variable :id="item.value" />
    </template>
  </v-autocomplete>
</template>
<script setup lang="ts">
import type {client, utils} from '@constl/ipa';

import {inject, ref} from 'vue';
import JetonVariable from './JetonVariable.vue';
import {enregistrerRecherche} from '../utils';
import RésultatRechercheVariable from '../recherche/RésultatRechercheVariable.vue';

defineProps<{interdites?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idVar: string): void;
}>();

const constl = inject<client.ClientConstellation>('constl');

const variableChoisie = ref<string>();
const recherche = ref<string>();
const résultatsRecherche = ref<utils.résultatRecherche<utils.infoRésultatTexte>[]>();

enregistrerRecherche({
  requète: recherche,
  réfRésultat: résultatsRecherche,
  fRecherche: async ({requète, nOuProfondeur, réfRésultat}) =>
    await constl?.recherche?.rechercherVariableSelonTexte({
      texte: requète,
      f: x => (réfRésultat.value = x),
      nRésultatsDésirés: nOuProfondeur,
    }),
  fRechercheDéfaut: async ({nOuProfondeur, réfRésultat}) => {
    return await constl?.recherche?.rechercherVariables({
      f: x => (réfRésultat.value = x),
      nRésultatsDésirés: nOuProfondeur,
    });
  },
});

const sélectionnée = (idVar: string) => {
  émettre('selectionnee', idVar);
};
</script>
