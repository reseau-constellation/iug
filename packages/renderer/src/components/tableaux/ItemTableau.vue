<template>
  <v-list-item>
    <template #prepend>
      <v-icon>mdi-table</v-icon>
    </template>
    <v-list-item-title class="mb-2">
      {{ nomTableau || t('tableaux.sansNom') }}
    </v-list-item-title>
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
import type {ClientConstellation} from '@constl/ipa';

import {inject, ref} from 'vue';
import SérieJetons from '../communs/SérieJetons.vue';
import CarteVariable from '../variables/CarteVariable.vue';
import ItemVariable from '../variables/ItemVariable.vue';
import JetonVariable from '../variables/JetonVariable.vue';
import {enregistrerÉcoute} from '/@/components/utils';

import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Nom tableau
const noms = ref<{[langue: string]: string}>({});
enregistrerÉcoute(
  constl?.tableaux.suivreNomsTableau({
    idTableau: props.id,
    f: x => (noms.value = x),
  }),
);
const nomTableau = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Variables
const variables = ref<string[]>();
enregistrerÉcoute(
  constl?.tableaux.suivreVariables({
    idTableau: props.id,
    f: x => (variables.value = x),
  }),
);
</script>
