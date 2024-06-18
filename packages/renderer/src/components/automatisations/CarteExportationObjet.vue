<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      />
    </template>
    <v-card
      class="mx-auto"
      :min-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex">
          {{ t('exportations.indice') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          />
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <options-exportation-objet @modifiee="val => format = val" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="flat"
          append-icon="mdi-download"
          :loading="enTéléchargement"
          @click="() => télécharger()"
        >
          {{ t('communs.télécharger') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type { automatisation } from '@constl/ipa';

import {ref} from 'vue';
import {useDisplay} from 'vuetify';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';


import OptionsExportationObjet from '/@/components/automatisations/OptionsExportationObjet.vue';
import { constellation } from '/@/components/utils';

const props = defineProps<{
  idObjet: string;
  typeObjet: 'nuée' | 'projet' | 'bd' | 'tableau';
}>();

const {mdAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = constellation();

// Navigation
const dialogue = ref(false);

// Format
const format = ref<{
    formatDoc: automatisation.formatTélécharger;
    langues: string[] | undefined;
    inclureDocuments: boolean;
}>();

// Télécharger
const enTéléchargement = ref(false);
const télécharger = async () => {
  if (!format.value)return;

  enTéléchargement.value = true;
  switch (props.typeObjet) {
    case 'tableau': {
        const données = await constl.tableaux.exporterDonnées({
            idTableau: props.idObjet,
            langues: format.value.langues,
            patience: 5000,
        });
        await constl.bds.exporterDocumentDonnées({
            données,
            formatDoc: format.value.formatDoc,
            inclureFichiersSFIP: format.value.inclureDocuments,
        });
        break;
    }
    case 'bd': {
        const données = await constl.bds.exporterDonnées({
            idBd: props.idObjet,
            langues: format.value.langues,
        });
        await constl.bds.exporterDocumentDonnées({
            données,
            formatDoc: format.value.formatDoc,
            inclureFichiersSFIP: format.value.inclureDocuments,
        });
        break;
    }
    case 'nuée': {
        const données = await constl.nuées.exporterDonnéesNuée({
            idNuée: props.idObjet,
            langues: format.value.langues,
        });
        await constl.bds.exporterDocumentDonnées({
            données,
            formatDoc: format.value.formatDoc,
            inclureFichiersSFIP: format.value.inclureDocuments,
        });
        break;
    }
    case 'projet':{
        const données = await constl.projets.exporterDonnées({
            idProjet: props.idObjet,
            langues: format.value.langues,
        });
        await constl.projets.exporterDocumentDonnées({
            données,
            formatDoc: format.value.formatDoc,
            inclureFichiersSFIP: format.value.inclureDocuments,
        });
        break;}
    default:
        break;
  }
  enTéléchargement.value = false;
  fermer();
};


// Fermer
const fermer = () => {
    dialogue.value = false;
};
</script>
