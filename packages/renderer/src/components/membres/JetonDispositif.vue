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

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import {obtIcôneDispositifDeType, utiliserNomEtTypeDispositif} from './utils';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

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
