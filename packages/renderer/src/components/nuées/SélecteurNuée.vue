<template>
  <v-autocomplete
    v-model="idNuéeSélectionnée"
    v-model:search="requète"
    :items="résultatsRecherche"
  >
    <template #item="{item}">
      <ResultatRechercheNuee :résultat="item.raw" />
    </template>
  </v-autocomplete>
</template>
<script setup lang="ts">
import {ref} from 'vue';

import ResultatRechercheNuee from '/@/components/recherche/RésultatRechercheNuée.vue';
import {constellation, rechercher} from '/@/components/utils';
import {watchEffect} from 'vue';

const émettre = defineEmits<{
  (é: 'selectionnee', idNuée?: string): void;
}>();

const constl = constellation();

// Sélection
const idNuéeSélectionnée = ref<string>();
watchEffect(() => {
  émettre('selectionnee', idNuéeSélectionnée.value);
});

// Contrôles recherche
const requète = ref('');
const {résultats: résultatsRecherche} = rechercher({
  requète,
  fRecherche: constl.recherche.rechercherNuéesSelonTexte,
  clefRequète: 'texte',
});
</script>
