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
        v-if="spécification.type === 'importation'"
        :spécification="spécification"
      />
      <jeton-fichier-exportation
        v-else
        :spécification="spécification"
      />
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';
import type {client} from '@constl/ipa';

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
  spécification: automatisation.SpécificationAutomatisation;
  statut: automatisation.ÉtatAutomatisation;
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
</script>
