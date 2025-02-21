<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
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
        <jeton-statut-automatisation
          v-if="statut"
          :statut="statut"
        />
        <jeton-fichier-importation
          v-if="specification.type === 'importation'"
          :spécification="specification"
        />
        <jeton-fichier-exportation
          v-else
          class="my-2"
          :spécification="specification"
          @click="() => changerFichierExportation()"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';

import {onMounted, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import {suivre} from '@constl/vue';
import {computed} from 'vue';
import DivisionCarte from '../communs/DivisionCarte.vue';
import JetonFichierExportation from './JetonFichierExportation.vue';
import JetonFichierImportation from './JetonFichierImportation.vue';
import JetonStatutAutomatisation from './JetonStatutAutomatisation.vue';
import {enregistrerÉcoute, utiliserConstellation} from '/@/components/utils';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

const props = defineProps<{
  specification: automatisation.SpécificationAutomatisation;
}>();

const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);

// Nom
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = ref<{[langue: string]: string}>();

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

// Statut
const statuts = suivre(constl.automatisations.suivreÉtatAutomatisations);
const statut = computed(() => statuts.value?.[props.specification.id]);

// Fichier
// const fichierExportation = ref(props.specification);
const changerFichierExportation = async () => {
  // const fichier = await choisirFichierSauvegarde();
  // if (fichier) fichierExportation.value = fichier;
};

// Sauvegarde
/*const sauvegarder = async () => {
  const automatisation: automatisation.SpécificationAutomatisation = {
    
  }
  await constl.automatisations.modifierAutomatisation({
    id: props.specification.id,
    automatisation
  })
}*/
</script>
