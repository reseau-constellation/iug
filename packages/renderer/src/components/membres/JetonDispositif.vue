<template>
  <v-chip
    :prepend-icon="icôneDispositif"
    variant="outlined"
    label
  >
    {{ nomDispositif || t('dispositifs.sansNom') }}
    <LienObjet :id="idDispositif" />
  </v-chip>
</template>
<script setup lang="ts">
import {computed} from 'vue';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import LienObjet from '../communs/LienObjet.vue';
import {obtIcôneDispositifDeType, utiliserNomEtTypeDispositif} from './utils';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const props = defineProps<{idDispositif: string; idCompte?: string}>();

// Info dispositif
const {nomDispositif, typeDispositif} = utiliserNomEtTypeDispositif({
  idDispositif: computed(() => props.idDispositif),
  idCompte: computed(() => props.idCompte),
});

// Icône
const icôneDispositif = computed(() => {
  return obtIcôneDispositifDeType(typeDispositif.value);
});
</script>
