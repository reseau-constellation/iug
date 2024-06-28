<template>
  <SelecteurBd
    v-if="!idBd"
    :multiples="false"
    @selectionnee="bds => (bdChoisie = bds[0])"
  />
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
import {computed, ref, watchEffect} from 'vue';

import ItemTableau from './ItemTableau.vue';
import JetonTableau from './JetonTableau.vue';
import SelecteurBd from '/@/components/bds/SélecteurBd.vue';

import {utiliserConstellation, suivre} from '../utils';

const props = defineProps<{idBd?: string}>();
const émettre = defineEmits<{
  (é: 'selectionne', idTableau?: string): void;
}>();

const constl = utiliserConstellation();

// Bd
const bdChoisie = ref<string>();
const bdFinale = computed(() => bdChoisie.value || props.idBd);

// Tableaux
const tableaux = suivre(constl.bds.suivreTableauxBd, {
  idBd: bdFinale,
});

// Contrôles
const idTableauSélectionné = ref<string>();
watchEffect(() => {
  émettre('selectionne', idTableauSélectionné.value);
});
</script>
