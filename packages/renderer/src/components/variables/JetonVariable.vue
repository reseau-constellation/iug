<template>
  <v-chip :prepend-icon="icône">
    <slot>
      {{ nomTraduit }}
    </slot>
  </v-chip>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import type {catégorieVariables} from '@constl/ipa/dist/src/variables';

import {computed, inject, ref} from 'vue';

import {enregistrerÉcoute} from '/@/composables/utils';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {icôneCatégorieVariable} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {traduireNom} = utiliserLangues();

// Icône
const icône = computed(() =>
  catégorie.value ? icôneCatégorieVariable(catégorie.value) : 'mdi-variable',
);
const catégorie = ref<catégorieVariables>();
enregistrerÉcoute(
  constl?.variables?.suivreCatégorieVariable({
    id: props.id,
    f: x => (catégorie.value = x),
  }),
);

// Nom
const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

enregistrerÉcoute(
  constl?.variables?.suivreNomsVariable({
    id: props.id,
    f: x => (noms.value = x),
  }),
);
</script>
