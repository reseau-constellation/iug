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
import type ClientConstellation from '@constl/ipa/dist/src/client';
import type {catégorieVariables} from '@constl/ipa/dist/src/variables';

import {computed, inject, ref} from 'vue';

import {enregistrerÉcoute} from '/@/components/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {icôneCatégorieVariable} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
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
