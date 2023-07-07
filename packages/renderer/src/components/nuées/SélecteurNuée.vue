<template>
  <v-autocomplete
    v-model="idNuéeSélectionnée"
    v-model:search="requèteRecherche"
    :items="résultatsRecherche"
  >
    <template #item="{item}">
      <ResultatRechercheNuee :résultat="item.raw" />
    </template>
  </v-autocomplete>
</template>
<script setup lang="ts">
import type {client, utils} from '@constl/ipa';
import {inject, ref} from 'vue';

import ResultatRechercheNuee from '/@/components/recherche/RésultatRechercheNuée.vue';
import {enregistrerRecherche} from '/@/components/utils';
import {watchEffect} from 'vue';

const émettre = defineEmits<{
  (é: 'selectionnee', idNuée?: string): void;
}>();

const constl = inject<client.ClientConstellation>('constl');

// Sélection
const idNuéeSélectionnée = ref<string>();
watchEffect(() => {
  émettre('selectionnee', idNuéeSélectionnée.value);
});

// Contrôles recherche
const requèteRecherche = ref<string>();
const résultatsRecherche =
  ref<
    utils.résultatRecherche<
      utils.infoRésultatTexte | utils.infoRésultatRecherche<utils.infoRésultatTexte>
    >[]
  >();

enregistrerRecherche({
  requète: requèteRecherche,
  réfRésultat: résultatsRecherche,
  fRecherche: async ({requète, nOuProfondeur, réfRésultat}) =>
    await constl?.recherche?.rechercherNuéeSelonTexte({
      texte: requète,
      f: x => (réfRésultat.value = x),
      nRésultatsDésirés: nOuProfondeur,
    }),
  fRechercheDéfaut: async ({nOuProfondeur, réfRésultat}) => {
    return await constl?.recherche?.rechercherNuées({
      f: x => (réfRésultat.value = x),
      nRésultatsDésirés: nOuProfondeur,
    });
  },
});
</script>
