<template>
  <v-list-item>
    <template #prepend>
      <v-icon>mdi-export</v-icon>
    </template>
    <v-list-item-title>
      <v-icon>{{ icôneTypeObjet }}</v-icon>
      <nom-tableau
        v-if="specification.typeObjet === 'tableau'"
        :id-tableau="specification.idObjet"
      />
      <nom-bd
        v-else-if="specification.typeObjet === 'bd'"
        :id-bd="specification.idObjet"
      />
      <nom-nuee
        v-else-if="specification.typeObjet === 'nuée'"
        :id-nuee="specification.idObjet"
      />
      <nom-projet
        v-else-if="specification.typeObjet === 'projet'"
        :id-projet="specification.idObjet"
      />
    </v-list-item-title>

    <jeton-fichier-exportation
      class="mx-2 my-2"
      :spécification="specification"
    />
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
import JetonFichierExportation from './JetonFichierExportation.vue';
import JetonStatutAutomatisation from './JetonStatutAutomatisation.vue';
import NomBd from '/@/components/bds/NomBd.vue';
import NomNuee from '/@/components/nuées/NomNuée.vue';
import NomProjet from '/@/components/projets/NomProjet.vue';
import NomTableau from '/@/components/tableaux/NomTableau.vue';
import {icôneObjet, utiliserConstellation} from '/@/components/utils';

const props = defineProps<{
  specification: automatisation.SpécificationExporter;
}>();

const constl = utiliserConstellation();

// Icône
const icôneTypeObjet = computed(() => icôneObjet(props.specification.typeObjet));

// Statut
const statuts = suivre(constl.automatisations.suivreÉtatAutomatisations);
const statut = computed(() => {
  return statuts.value ? statuts.value[props.specification.id] : undefined;
});
</script>
