<template>
  <v-chip
    class="mb-2 me-2"
    :prepend-icon="icône"
    variant="outlined"
    size="small"
  >
    <slot>
      {{ nomTraduit || t('variables.sansNom') }}
    </slot>
  </v-chip>
</template>

<script setup lang="ts">
import type {variables} from '@constl/ipa';

import {computed, ref} from 'vue';

import {constellation, enregistrerÉcoute} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {icôneCatégorieVariable} from '/@/components/variables/utils';

const props = defineProps<{id: string}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Icône
const icône = computed(() =>
  catégorie.value ? icôneCatégorieVariable(catégorie.value) : 'mdi-variable',
);
const catégorie = ref<variables.catégorieVariables>();
enregistrerÉcoute(
  constl.variables.suivreCatégorieVariable({
    idVariable: props.id,
    f: x => (catégorie.value = x),
  }),
);

// Nom
const noms = ref<{[lng: string]: string}>({});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

enregistrerÉcoute(
  constl.variables.suivreNomsVariable({
    idVariable: props.id,
    f: x => (noms.value = x),
  }),
);
</script>
