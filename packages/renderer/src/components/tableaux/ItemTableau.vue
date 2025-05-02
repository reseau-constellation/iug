<template>
  <v-list-item>
    <template #prepend>
      <v-icon>mdi-table</v-icon>
    </template>
    <template #title>
      {{ nomTableau || t('tableaux.sansNom') }}
    </template>
    <série-jetons
      :items="variables"
      :n-max="3"
    >
      <template #jeton="{id: idVariable}">
        <carte-variable :id="idVariable">
          <template #activator="{props: propsActivateur}">
            <JetonVariable
              v-bind="propsActivateur"
              :id="idVariable"
              size="small"
            />
          </template>
        </carte-variable>
      </template>
      <template #itemListe="{id: idVariable}">
        <carte-variable :id="idVariable">
          <template #activator="{props: propsActivateur}">
            <item-variable
              v-bind="propsActivateur"
              :id="idVariable"
            />
          </template>
        </carte-variable>
      </template>
    </série-jetons>
  </v-list-item>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';

import SérieJetons from '/@/components/communs/SérieJetons.vue';
import {utiliserConstellation} from '/@/components/utils';
import CarteVariable from '/@/components/variables/CarteVariable.vue';
import ItemVariable from '/@/components/variables/ItemVariable.vue';
import JetonVariable from '/@/components/variables/JetonVariable.vue';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import { computed } from 'vue';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Nom tableau
const noms = suivre(constl.tableaux.suivreNomsTableau, {idTableau: computed(() => props.id)});
const nomTableau = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Variables
const variables = suivre(constl.tableaux.suivreVariables, {idTableau: computed(() => props.id)});
</script>
