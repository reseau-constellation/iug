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
import type {MandataireClientConstellation} from '@constl/mandataire';


import {ref, onMounted, inject} from 'vue';
import {useDisplay} from 'vuetify';

import DivisionCarte from '../communs/DivisionCarte.vue';
import JetonFichierExportation from './JetonFichierExportation.vue';
import JetonFichierImportation from './JetonFichierImportation.vue';
import JetonStatutAutomatisation from './JetonStatutAutomatisation.vue';
import {enregistrerÉcoute} from '/@/components/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {mdAndUp} = useDisplay();

const props = defineProps<{
  specification: automatisation.SpécificationAutomatisation;
  statut: automatisation.ÉtatAutomatisation;
}>();

const constl = inject<MandataireClientConstellation>('constl');

// Nom
const {traduireNom} = utiliserLangues();

const noms = ref<{[langue: string]: string}>({});

onMounted(() => {
  if (props.specification.type === 'importation') {
    enregistrerÉcoute(
      constl?.tableaux.suivreNomsTableau({
        idTableau: props.specification.idTableau,
        f: x => (noms.value = x),
      }),
    );
  } else {
    switch (props.specification.typeObjet) {
      case 'tableau':
        enregistrerÉcoute(
          constl?.tableaux.suivreNomsTableau({
            idTableau: props.specification.idObjet,
            f: x => (noms.value = x),
          }),
        );
        break;
      case 'projet':
        enregistrerÉcoute(
          constl?.projets.suivreNomsProjet({
            idProjet: props.specification.idObjet,
            f: x => (noms.value = x),
          }),
        );
        break;
      case 'bd':
        enregistrerÉcoute(
          constl?.bds.suivreNomsBd({
            idBd: props.specification.idObjet,
            f: x => (noms.value = x),
          }),
        );
        break;
      case 'nuée':
        enregistrerÉcoute(
          constl?.nuées.suivreNomsNuée({
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

const nom = traduireNom(noms);
</script>
