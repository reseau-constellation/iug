<template>
  <v-autocomplete
    v-model="idsMotsClefsSélectionnées"
    v-model:search="requète"
    :items="résultatsPermisRecherche"
    :multiple="multiples"
    :label="t('motsClefs.recherche.étiquette')"
    variant="outlined"
  >
    <template #item="{item}">
      <ResultatRechercheMotClef :résultat="item.raw" />
    </template>
  </v-autocomplete>
  <v-list>
    <NouveauMotClef @nouveau="id => sélectionner(id)">
      <template #activator="{props: propsActivateur}">
        <v-list-item
          v-bind="propsActivateur"
          :title="t('motsClefs.nouveau.btn')"
          prepend-icon="mdi-plus"
        >
        </v-list-item>
      </template>
    </NouveauMotClef>
  </v-list>
</template>
<script setup lang="ts">
import {ref} from 'vue';

import ResultatRechercheMotClef from '/@/components/recherche/RésultatRechercheMotClef.vue';
import {constellation, rechercher} from '/@/components/utils';
import {watchEffect} from 'vue';
import {computed} from 'vue';
import NouveauMotClef from './NouveauMotClef.vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{multiples: boolean; interdites?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsMotsClefs: string[]): void;
}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

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

const sélectionner = ({id}: {id: string}) => {
  console.log(id);
  // à faire
};
</script>
