<template>
  <v-list-item>
    <v-list-item-title>
      {{ nomVariableTraduit }}
    </v-list-item-title>

    <template #append>
      <v-btn
        v-if="modificationPermise"
        icon="mdi-delete"
        variant="flat"
        @click="effacerColonne"
      />
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import type {valid} from '@constl/ipa';

import {ref, watchEffect} from 'vue';
import {suivre} from '@constl/vue';

import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '/@/components/utils';

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const props = defineProps<{
  idVariable: string;
  index?: boolean;
  modificationPermise: boolean;
  règles: valid.règleVariable[];
}>();

const émettre = defineEmits<{
  (é: 'modifier-colonne', info: {idVariable: string; index?: boolean}): void;
  (é: 'effacer-colonne'): void;
}>();

const constl = utiliserConstellation();

const choixVariable = ref<string>(props.idVariable);
watchEffect(() => {
  choixVariable.value = props.idVariable;
});

// Nom variable
const nomsVariable = suivre(constl.variables.suivreNomsVariable, {idVariable: props.idVariable});
const nomVariableTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(nomsVariable);

// Index
const choixIndex = ref<boolean>(props.index);
watchEffect(() => {
  choixIndex.value = props.index;
});

// Modification
watchEffect(() => {
  const spécColonne = {
    idVariable: choixVariable.value,
    index: choixIndex.value,
  };
  émettre('modifier-colonne', spécColonne);
});
const effacerColonne = () => émettre('effacer-colonne');
</script>
