<template>
  <v-chip
    :prepend-icon="icôneDispositif"
    variant="outlined"
  >
    {{ nomDispositif || t('dispositifs.sansNom') }}
  </v-chip>
</template>
<script setup lang="ts">
import {computed} from 'vue';

import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';

import {obtIcôneDispositifDeType, utiliserNomEtTypeDispositif} from './utils';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const props = defineProps<{idDispositif: string; idCompte?: string}>();

// Info dispositif
const {nomDispositif, typeDispositif} = utiliserNomEtTypeDispositif({
  idDispositif: props.idDispositif,
  idCompte: props.idCompte,
});

// Icône
const icôneDispositif = computed(() => {
  return obtIcôneDispositifDeType(typeDispositif.value);
});
</script>
