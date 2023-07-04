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
import type {client} from '@constl/ipa';
import {inject, ref} from 'vue';
import SérieJetons from '../communs/SérieJetons.vue';
import CarteVariable from '../variables/CarteVariable.vue';
import ItemVariable from '../variables/ItemVariable.vue';
import JetonVariable from '../variables/JetonVariable.vue';
import {enregistrerÉcoute} from '/@/components/utils';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';

const props = defineProps<{id: string}>();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {traduireNom} = utiliserLangues();

// Nom tableau
const noms = ref<{[langue: string]: string}>({});
enregistrerÉcoute(
  constl?.tableaux?.suivreNomsTableau({
    idTableau: props.id,
    f: x => (noms.value = x),
  }),
);
const nomTableau = traduireNom(noms);

// Variables
const variables = ref<string[]>();
enregistrerÉcoute(
  constl?.tableaux?.suivreVariables({
    idTableau: props.id,
    f: x => (variables.value = x),
  }),
);
</script>
