<template>
  <v-chip :prepend-icon="icôneDispositif">{{ nomDispositif }}</v-chip>
</template>
<script setup lang="ts">
import {computed} from 'vue';
import {obtIcôneDispositifDeType, utiliserNomEtTypeDispositif} from './utils';

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
