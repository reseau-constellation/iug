<template>
  {{ nomFinal }}
  <carte-colonne-tableau
    :id-colonne="idColonne"
    :id-variable="idVariable"
    :id-tableau="idTableau"
    :index="index"
    :regles="regles"
    :permission-modifier="permissionModifier"
    @sauvegarder="info => émettre('sauvegarder', info)"
  >
    <template #activator="{props: propsActivateur}">
      <v-icon
        v-bind="propsActivateur"
        class="ms-1"
        icon="mdi-pencil"
        size="x-small"
      />
    </template>
  </carte-colonne-tableau>
</template>
<script setup lang="ts">
import type {valid} from '@constl/ipa';

import {computed} from 'vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import CarteColonneTableau from './CarteColonneTableau.vue';
import {constellation, suivre} from '../utils';

const props = defineProps<{
  index: boolean;
  permissionModifier: boolean;
  idColonne: string;
  regles: valid.règleColonne[] | undefined;
  idVariable: string;
  idTableau: string;
}>();
const émettre = defineEmits<{
  (
    é: 'sauvegarder',
    args: {
      index: boolean;
      variable: string;
      règles: {
        nouvelles: valid.règleVariable[];
        àEffacer: string[];
      };
    },
  ): void;
}>();

const constl = constellation();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Noms
const noms = suivre(constl.variables.suivreNomsVariable, {
  idVariable: props.idVariable,
});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);
const nomFinal = computed(() => {
  return nomTraduit.value || props.idColonne;
});

</script>
