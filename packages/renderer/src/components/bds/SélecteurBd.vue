<template>
  <v-autocomplete
    v-model="idsBdsSélectionnées"
    v-model:search="requèteRecherche"
    :items="résultatsPermisRecherche"
    :multiple="multiples"
  >
    <template #item="{item}">
      <ResultatRechercheBd :resultat="item.raw" />
    </template>
  </v-autocomplete>
</template>
<script setup lang="ts">
import {ref} from 'vue';

import ResultatRechercheBd from '/@/components/recherche/RésultatRechercheBd.vue';
import {constellation, rechercher} from '/@/components/utils';
import {watchEffect} from 'vue';
import {computed} from 'vue';

const props = defineProps<{multiples: boolean; interdites?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsBds: string[]): void;
}>();

const constl = constellation();

// Sélection
const idsBdsSélectionnées = ref<string[]>([]);
watchEffect(() => {
  émettre('selectionnee', idsBdsSélectionnées.value);
});

// Contrôles recherche
const requèteRecherche = ref('');
const résultatsPermisRecherche = computed(() => {
  return résultatsRecherche.value?.filter(r => !(props.interdites || []).includes(r.id));
});

const {résultats: résultatsRecherche} = rechercher({
  requète: requèteRecherche,
  fRecherche: constl.recherche.rechercherBdsSelonTexte,
  clefRequète: 'texte',
});
</script>
