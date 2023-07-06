<template>
  <v-autocomplete
    v-model="idBdSélectionnée"
    v-model:search="requèteRecherche"
    :items="résultatsRecherche"
  >
    <template #item="{item}">
      <RésultatRechercheBd :résultat="item.raw" />
    </template>
  </v-autocomplete>
</template>
<script setup lang="ts">
import type {client, utils} from '@constl/ipa';
import {type Ref, inject, ref} from 'vue';

import RésultatRechercheBd from '/@/components/recherche/RésultatRechercheBd.vue';
import {enregistrerRecherche} from '/@/components/utils';
import {watchEffect} from 'vue';

const émettre = defineEmits<{
  (é: 'selectionnee', idBd?: string): void;
}>();

const constl = inject<client.ClientConstellation>('constl');

// Sélection
const idBdSélectionnée = ref<string>();
watchEffect(() => {
  émettre('selectionnee', idBdSélectionnée.value);
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
  fRecherche: async ({
    requète,
    nOuProfondeur,
    réfRésultat,
  }: {
    requète: string;
    nOuProfondeur: number;
    réfRésultat: Ref<
      utils.résultatRecherche<
        utils.infoRésultatTexte | utils.infoRésultatRecherche<utils.infoRésultatTexte>
      >[]
    >;
  }) =>
    await constl?.recherche?.rechercherBdSelonTexte({
      texte: requète,
      f: x => (réfRésultat.value = x),
      nRésultatsDésirés: nOuProfondeur,
    }),
  fRechercheDéfaut: async ({
    nOuProfondeur,
    réfRésultat,
  }: {
    nOuProfondeur: number;
    réfRésultat: Ref<utils.résultatRecherche<utils.infoRésultatTexte>[]>;
  }) => {
    return await constl?.recherche?.rechercherBds({
      f: x => (réfRésultat.value = x),
      nRésultatsDésirés: nOuProfondeur,
    });
  },
});
</script>
