<template>
  <v-autocomplete
    v-model="idsBdsSélectionnées"
    v-model:search="requèteRecherche"
    :items="résultatsPermisRecherche"
    :multiple="multiples"
  >
    <template #item="{item}">
      <RésultatRechercheBd :résultat="item.raw" />
    </template>
  </v-autocomplete>
</template>
<script setup lang="ts">
import type {client, utils} from '@constl/ipa';
import {inject, ref} from 'vue';

import RésultatRechercheBd from '/@/components/recherche/RésultatRechercheBd.vue';
import {enregistrerRecherche} from '/@/components/utils';
import {watchEffect} from 'vue';
import {computed} from 'vue';

const props = defineProps<{multiples: boolean; interdites?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsBds: string[]): void;
}>();

const constl = inject<client.ClientConstellation>('constl');

// Sélection
const idsBdsSélectionnées = ref<string[]>([]);
watchEffect(() => {
  émettre('selectionnee', idsBdsSélectionnées.value);
});

// Contrôles recherche
const requèteRecherche = ref<string>();
const résultatsRecherche =
  ref<
    utils.résultatRecherche<
      utils.infoRésultatTexte | utils.infoRésultatRecherche<utils.infoRésultatTexte>
    >[]
  >();
const résultatsPermisRecherche = computed(() => {
  return résultatsRecherche.value?.filter(r => !(props.interdites || []).includes(r.id));
});

enregistrerRecherche({
  requète: requèteRecherche,
  réfRésultat: résultatsRecherche,
  fRecherche: async ({requète, nOuProfondeur, réfRésultat}) =>
    await constl?.recherche?.rechercherBdSelonTexte({
      texte: requète,
      f: x => (réfRésultat.value = x),
      nRésultatsDésirés: nOuProfondeur,
    }),
  fRechercheDéfaut: async ({nOuProfondeur, réfRésultat}) => {
    return await constl?.recherche?.rechercherBds({
      f: x => (réfRésultat.value = x),
      nRésultatsDésirés: nOuProfondeur,
    });
  },
});
</script>
