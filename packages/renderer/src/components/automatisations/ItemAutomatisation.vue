<template>
  <v-list-item>
    <template #prepend>
      <v-icon>{{ spécification.type === 'exportation' ? 'mdi-export' : 'mdi-import' }}</v-icon>
    </template>
    <v-list-item-title>
      <v-icon>{{ icôneTypeObjet }}</v-icon>
      {{ nom }}
    </v-list-item-title>
    <jeton-fichier-importation
      v-if="spécification.type === 'importation'"
      :spécification="spécification"
    />
    <jeton-statut-automatisation
      v-if="statut"
      :statut="statut"
    />
    <v-skeleton-loader
      v-else
      type="chip"
    />
  </v-list-item>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';
import type {client} from '@constl/ipa';

import {computed, inject, ref, onMounted} from 'vue';
import {VSkeletonLoader} from 'vuetify/labs/VSkeletonLoader';

import JetonFichierImportation from './JetonFichierImportation.vue';
import JetonStatutAutomatisation from './JetonStatutAutomatisation.vue';
import {enregistrerÉcoute} from '/@/components/utils';
import {utiliserLangues} from '/@/plugins/localisation/localisation';

const props = defineProps<{
  spécification: automatisation.SpécificationAutomatisation;
  statut?: automatisation.ÉtatAutomatisation;
}>();

const constl = inject<client.ClientConstellation>('constl');

// Nom
const {traduireNom} = utiliserLangues();

const noms = ref<{[langue: string]: string}>({});

onMounted(() => {
  if (props.spécification.type === 'importation') {
    enregistrerÉcoute(
      constl?.tableaux?.suivreNomsTableau({
        idTableau: props.spécification.idTableau,
        f: x => (noms.value = x),
      }),
    );
  } else {
    switch (props.spécification.typeObjet) {
      case 'tableau':
        enregistrerÉcoute(
          constl?.tableaux?.suivreNomsTableau({
            idTableau: props.spécification.idObjet,
            f: x => (noms.value = x),
          }),
        );
        break;
      case 'projet':
        enregistrerÉcoute(
          constl?.projets?.suivreNomsProjet({
            id: props.spécification.idObjet,
            f: x => (noms.value = x),
          }),
        );
        break;
      case 'bd':
        enregistrerÉcoute(
          constl?.bds?.suivreNomsBd({
            id: props.spécification.idObjet,
            f: x => (noms.value = x),
          }),
        );
        break;
      case 'nuée':
        enregistrerÉcoute(
          constl?.nuées?.suivreNomsNuée({
            idNuée: props.spécification.idObjet,
            f: x => (noms.value = x),
          }),
        );
        break;
      default:
        throw new Error(JSON.stringify(props.spécification));
    }
  }
});

const nom = traduireNom(noms);

// Icône
const icôneTypeObjet = computed(() => {
  if (props.spécification.type === 'importation') {
    return 'mdi-table';
  } else {
    switch (props.spécification.typeObjet) {
      case 'tableau':
        return 'mdi-table';
      case 'bd':
        return 'mdi-database-outline';
      case 'projet':
        return 'mdi-folder-outline';
      case 'nuée':
        return 'mdi-bird';
      default:
        throw new Error(JSON.stringify(props.spécification));
    }
  }
});
</script>
