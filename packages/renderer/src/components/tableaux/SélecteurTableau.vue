<template>
  <v-select
    v-model="idTableauSélectionné"
    :loading="!tableaux"
    :disabled="!tableaux"
    :items="tableaux"
    item-value="id"
    item-title="id"
  >
    <template #selection="{item}">
      <jeton-tableau :id="item.value" />
    </template>
    <template #item="{item}">
      <item-tableau :id="item.value" />
    </template>
  </v-select>
</template>
<script setup lang="ts">
import {ref, watchEffect} from 'vue';

import ItemTableau from './ItemTableau.vue';
import {constellation, suivre} from '../utils';
import { computed } from 'vue';

const props = defineProps<{idBd?: string}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idTableau?: string): void;
}>();

const constl = constellation();

// Tableaux
const tableaux = suivre(
  constl.bds.suivreTableauxBd,
  {
    idBd: computed(()=>props.idBd),
  },
);

// Contrôles
const idTableauSélectionné = ref<string>();
watchEffect(() => {
  émettre('selectionnee', idTableauSélectionné.value);
});
</script>
