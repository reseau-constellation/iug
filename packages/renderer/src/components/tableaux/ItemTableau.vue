<template>
  <v-list-item>
    <template #prepend>
      <v-icon>mdi-table</v-icon>
    </template>
    <v-list-item-title>
      {{ nomTableau || t('tableaux.sansNom') }}
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import {inject, ref} from 'vue';
import { enregistrerÉcoute } from '/@/composables/utils';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import { utiliserLangues } from '/@/plugins/localisation/localisation';


const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {traduireNom} = utiliserLangues();

// Nom tableau
const noms = ref<{[langue: string]: string}>({});
enregistrerÉcoute(
  constl?.tableaux?.suivreNomsTableau({
    idTableau: props.id,
    f: x=>noms.value = x,
  }),
);
const nomTableau = traduireNom(noms);
</script>
