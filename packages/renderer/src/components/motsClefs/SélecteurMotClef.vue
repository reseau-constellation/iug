<template>
  <v-autocomplete
    v-model="idsMotsClefsSélectionnées"
    v-model:search="requète"
    :items="résultatsPermisRecherche"
    :multiple="multiples"
  >
    <template #item="{item}">
      <ResultatRechercheMotClef :résultat="item.raw" />
    </template>
  </v-autocomplete>
</template>
<script setup lang="ts">
import {ref} from 'vue';

import ResultatRechercheMotClef from '/@/components/recherche/RésultatRechercheMotClef.vue';
import {constellation, rechercher} from '/@/components/utils';
import {watchEffect} from 'vue';
import {computed} from 'vue';

const props = defineProps<{multiples: boolean; interdites?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsMotsClefs: string[]): void;
}>();

const constl = constellation();

// Sélection
const idsMotsClefsSélectionnées = ref<string[]>([]);
watchEffect(() => {
  émettre('selectionnee', idsMotsClefsSélectionnées.value);
});

// Contrôles recherche
const requète = ref('');
const {résultats: résultatsRecherche} = rechercher({
  requète: requète,
  fRecherche: constl.recherche.rechercherMotsClefsSelonTexte,
  clefRequète: 'texte',
});
const résultatsPermisRecherche = computed(() => {
  return résultatsRecherche.value?.filter(r => !(props.interdites || []).includes(r.id));
});

</script>
