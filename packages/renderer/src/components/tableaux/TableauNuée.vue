<template>
  <tableau-base
    :colonnes="colonnes"
    :donnees="donnéesPourTableau"
  />
</template>
<script setup lang="ts">
import type {tableaux} from '@constl/ipa';

import {computed} from 'vue';

import {constellation, suivre} from '/@/components/utils';

import TableauBase from './TableauBase.vue';

const constl = constellation();
const props = defineProps<{idNuée: string; clefTableau: string}>();

const monCompte = suivre(constl.suivreIdCompte);

const données = suivre(constl.nuées.suivreDonnéesTableauNuée<tableaux.élémentBdListeDonnées>, {
  idNuée: props.idNuée,
  clefTableau: props.clefTableau,
});
const donnéesPourTableau = computed(() => {
  return données.value?.map(d => ({
    données: {
      ...d.élément,
      contributeur: d.idCompte,
    },
    éditable: d.idCompte === monCompte.value,
  }));
});

const colonnes = suivre(constl.nuées.suivreColonnesTableauNuée<tableaux.InfoColAvecCatégorie>, {
  idNuée: props.idNuée,
  clefTableau: props.clefTableau,
  catégories: true,
});
</script>
