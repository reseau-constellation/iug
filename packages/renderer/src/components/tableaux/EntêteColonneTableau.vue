<template>
  <carte-colonne-tableau
    :id-tableau="idTableau"
    :id-colonne="idColonne"
    :id-variable="idVariable"
    :index="index"
    :regles="règles"
    :permission-modifier="permissionModifier"
  >
    <template #activator="{props: propsActivateur}">
      <span v-bind="propsActivateur">{{ nomFinal }}</span>
    </template>
  </carte-colonne-tableau>
</template>
<script setup lang="ts">
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {constellation, suivre} from '../utils';
import CarteColonneTableau from './CarteColonneTableau.vue';
import {computed} from 'vue';

const props = defineProps<{
  index: boolean;
  permissionModifier: boolean;
  idColonne: string;
  idTableau: string;
  idVariable: string;
}>();

const constl = constellation();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Noms
const noms = suivre(
  constl.variables.suivreNomsVariable,
  {
    idVariable: props.idVariable,
  },
);
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);
const nomFinal = computed(() => {
  return nomTraduit.value || props.idColonne;
});
</script>
