<template>
  <v-list-item>
    <template #prepend>
      <v-icon>mdi-import</v-icon>
    </template>
    <v-list-item-title>
      <v-icon>mdi-table</v-icon>
      <nom-tableau :id-tableau="spécification.idTableau" />
    </v-list-item-title>

    <jeton-fichier-importation :spécification="spécification" />
    <jeton-statut-automatisation
      v-if="statut"
      :statut="statut"
    />
  </v-list-item>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';

import {computed} from 'vue';

import {suivre} from '@constl/vue';
import JetonFichierImportation from './JetonFichierImportation.vue';
import JetonStatutAutomatisation from './JetonStatutAutomatisation.vue';
import NomTableau from '/@/components/tableaux/NomTableau.vue';
import {utiliserConstellation} from '/@/components/utils';

const props = defineProps<{
  spécification: automatisation.SpécificationImporter;
}>();

const constl = utiliserConstellation();

// Statut
const statuts = suivre(constl.automatisations.suivreÉtatAutomatisations);
const statut = computed(() => {
  return statuts.value ? statuts.value[props.spécification.id] : undefined;
});
</script>
