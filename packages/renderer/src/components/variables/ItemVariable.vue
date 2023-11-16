<template>
  <v-list-item>
    <template #prepend>
      <v-icon>{{ icône }}</v-icon>
    </template>
    <v-list-item-title>
      <slot>
        {{ nomTraduit || t('variables.sansNom') }}
      </slot>
    </v-list-item-title>
  </v-list-item>
</template>

<script setup lang="ts">
import type {variables} from '@constl/ipa';
import type {ClientConstellation} from '@constl/ipa';

import {computed, inject, ref} from 'vue';

import {enregistrerÉcoute} from '/@/components/utils';
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {icôneCatégorieVariable} from '/@/components/variables/utils';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Icône
const icône = computed(() =>
  catégorie.value ? icôneCatégorieVariable(catégorie.value) : 'mdi-variable',
);
const catégorie = ref<variables.catégorieVariables>();
enregistrerÉcoute(
  constl?.variables.suivreCatégorieVariable({
    idVariable: props.id,
    f: x => (catégorie.value = x),
  }),
);

// Nom
const noms = ref<{[lng: string]: string}>({});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

enregistrerÉcoute(
  constl?.variables.suivreNomsVariable({
    idVariable: props.id,
    f: x => (noms.value = x),
  }),
);
</script>
