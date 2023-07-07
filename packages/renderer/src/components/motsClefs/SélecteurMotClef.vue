<template>
  <v-autocomplete
    v-model="idsMotsClefsSélectionnées"
    v-model:search="requèteRecherche"
    :items="résultatsPermisRecherche"
    :multiple="multiples"
  >
    <template #item="{item}">
      <ResultatRechercheMotClef :résultat="item.raw" />
    </template>
  </v-autocomplete>
</template>
<script setup lang="ts">
import type {client, utils} from '@constl/ipa';
import {inject, ref} from 'vue';

import ResultatRechercheMotClef from '/@/components/recherche/RésultatRechercheMotClef.vue';
import {enregistrerRecherche} from '/@/components/utils';
import {watchEffect} from 'vue';
import {computed} from 'vue';

const props = defineProps<{multiples: boolean; interdites?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsMotsClefs: string[]): void;
}>();

const constl = inject<client.ClientConstellation>('constl');

// Sélection
const idsMotsClefsSélectionnées = ref<string[]>([]);
watchEffect(() => {
  émettre('selectionnee', idsMotsClefsSélectionnées.value);
});

// Contrôles recherche
const requèteRecherche = ref<string>();
const résultatsRecherche = ref<utils.résultatRecherche<utils.infoRésultatTexte>[]>();
const résultatsPermisRecherche = computed(() => {
  return résultatsRecherche.value?.filter(r => !(props.interdites || []).includes(r.id));
});

enregistrerRecherche({
  requète: requèteRecherche,
  réfRésultat: résultatsRecherche,
  fRecherche: async ({requète, nOuProfondeur, réfRésultat}) =>
    await constl?.recherche?.rechercherMotClefSelonTexte({
      texte: requète,
      f: x => (réfRésultat.value = x),
      nRésultatsDésirés: nOuProfondeur,
    }),
  fRechercheDéfaut: async ({nOuProfondeur, réfRésultat}) => {
    return await constl?.recherche?.rechercherMotsClefs({
      f: x => (réfRésultat.value = x),
      nRésultatsDésirés: nOuProfondeur,
    });
  },
});
</script>
