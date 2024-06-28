<template>
  <v-list-item>
    <template #prepend>
      <v-icon>{{ icône }}</v-icon>
    </template>
    <template #title>
      <slot>
        <span v-if="noms">{{ nomTraduit || t('variables.sansNom') }}</span>
        <v-skeleton-loader
          v-else
          type="list-item-two-line"
        ></v-skeleton-loader>
      </slot>
    </template>
    <template #subtitle>
      <slot>
        <span v-if="descrTraduite">{{ descrTraduite }}</span>
      </slot>
    </template>
    <template #append>
      <lien-objet :id="id"></lien-objet>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import {computed} from 'vue';

import {utiliserConstellation, suivre} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {icôneCatégorieVariable} from '/@/components/variables/utils';
import LienObjet from '../communs/LienObjet.vue';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Icône
const icône = computed(() =>
  catégorie.value ? icôneCatégorieVariable(catégorie.value) : 'mdi-variable',
);
const catégorie = suivre(constl.variables.suivreCatégorieVariable, {idVariable: props.id});

// Nom
const noms = suivre(constl.variables.suivreNomsVariable, {idVariable: props.id});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Description
const descriptions = suivre(constl.variables.suivreDescriptionsVariable, {idVariable: props.id});
const descrTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);
</script>
