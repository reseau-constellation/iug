<template>
  <v-list-item>
    <template #prepend>
      <v-icon>{{ spécification.type === 'exportation' ? 'mdi-export' : 'mdi-import' }}</v-icon>
    </template>
    <v-list-item-title>
      <v-icon>{{ icôneTypeObjet }}</v-icon>
      {{ nom || sansNom }}
    </v-list-item-title>

    <jeton-fichier-importation
      v-if="spécification.type === 'importation'"
      :spécification="spécification"
    />
    <jeton-fichier-exportation
      v-else
      class="mx-2 my-2"
      :spécification="spécification"
    />
    <jeton-statut-automatisation
      v-if="statut"
      :statut="statut"
    />
  </v-list-item>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';

import {computed, onMounted, ref} from 'vue';

import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import JetonFichierImportation from './JetonFichierImportation.vue';
import JetonFichierExportation from './JetonFichierExportation.vue';
import JetonStatutAutomatisation from './JetonStatutAutomatisation.vue';
import {enregistrerÉcoute, icôneObjet, utiliserConstellation} from '/@/components/utils';
import { suivre } from '@constl/vue';

const props = defineProps<{
  spécification: automatisation.SpécificationAutomatisation;
}>();

const constl = utiliserConstellation();

// Nom
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = ref<{[langue: string]: string}>();

onMounted(() => {
  if (props.spécification.type === 'importation') {
    enregistrerÉcoute(
      constl.tableaux.suivreNomsTableau({
        idTableau: props.spécification.idTableau,
        f: x => (noms.value = x),
      }),
    );
  } else {
    switch (props.spécification.typeObjet) {
      case 'tableau':
        enregistrerÉcoute(
          constl.tableaux.suivreNomsTableau({
            idTableau: props.spécification.idObjet,
            f: x => (noms.value = x),
          }),
        );
        break;
      case 'projet':
        enregistrerÉcoute(
          constl.projets.suivreNomsProjet({
            idProjet: props.spécification.idObjet,
            f: x => (noms.value = x),
          }),
        );
        break;
      case 'bd':
        enregistrerÉcoute(
          constl.bds.suivreNomsBd({
            idBd: props.spécification.idObjet,
            f: x => (noms.value = x),
          }),
        );
        break;
      case 'nuée':
        enregistrerÉcoute(
          constl.nuées.suivreNomsNuée({
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

const nom = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

const sansNom = computed(() => {
  if (props.spécification.type === 'importation') return 'tableaux.sansNom';
  else {
    switch (props.spécification.typeObjet) {
      case 'bd': return 'bds.sansNom';
      case 'nuée': return 'nuées.sansNom';
      case 'projet': return 'projets.sansNom';
      case 'tableau': return 'tableaux.sansNom';
      default: return 'communs.sansNom';
    }
  };
});

// Icône
const icôneTypeObjet = computed(() => {
  if (props.spécification.type === 'importation') {
    return 'mdi-table';
  } else {
    return icôneObjet(props.spécification.typeObjet);
  }
});

// Statut
const statuts = suivre(constl.automatisations.suivreÉtatAutomatisations);
const statut = computed(() => {
  return statuts.value ? statuts.value[props.spécification.id] : undefined;
});
</script>
