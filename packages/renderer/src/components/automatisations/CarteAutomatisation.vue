<template>
  <v-card
    class="mx-auto"
    :max-width="mdAndUp ? 500 : 300"
  >
    <v-card-item>
      <v-card-title>{{ nom }}</v-card-title>
    </v-card-item>
    <v-card-text>
      <division-carte
        :titre="t('automatisations.statut')"
        :en-attente="false"
      />
      <jeton-statut-automatisation :statut="statut" />
      <jeton-fichier-importation
        v-if="specification.type === 'importation'"
        :spécification="specification"
      />
      <jeton-fichier-exportation
        v-else
        :spécification="specification"
      />
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';

import {ref, onMounted} from 'vue';
import {useDisplay} from 'vuetify';

import DivisionCarte from '../communs/DivisionCarte.vue';
import JetonFichierExportation from './JetonFichierExportation.vue';
import JetonFichierImportation from './JetonFichierImportation.vue';
import JetonStatutAutomatisation from './JetonStatutAutomatisation.vue';
import {constellation, enregistrerÉcoute} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const {mdAndUp} = useDisplay();

const props = defineProps<{
  specification: automatisation.SpécificationAutomatisation;
  statut: automatisation.ÉtatAutomatisation;
}>();

const constl = constellation();

// Nom
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = ref<{[langue: string]: string}>({});

onMounted(() => {
  if (props.specification.type === 'importation') {
    enregistrerÉcoute(
      constl.tableaux.suivreNomsTableau({
        idTableau: props.specification.idTableau,
        f: x => (noms.value = x),
      }),
    );
  } else {
    switch (props.specification.typeObjet) {
      case 'tableau':
        enregistrerÉcoute(
          constl.tableaux.suivreNomsTableau({
            idTableau: props.specification.idObjet,
            f: x => (noms.value = x),
          }),
        );
        break;
      case 'projet':
        enregistrerÉcoute(
          constl.projets.suivreNomsProjet({
            idProjet: props.specification.idObjet,
            f: x => (noms.value = x),
          }),
        );
        break;
      case 'bd':
        enregistrerÉcoute(
          constl.bds.suivreNomsBd({
            idBd: props.specification.idObjet,
            f: x => (noms.value = x),
          }),
        );
        break;
      case 'nuée':
        enregistrerÉcoute(
          constl.nuées.suivreNomsNuée({
            idNuée: props.specification.idObjet,
            f: x => (noms.value = x),
          }),
        );
        break;
      default:
        throw new Error(JSON.stringify(props.specification));
    }
  }
});

const nom = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);
</script>
