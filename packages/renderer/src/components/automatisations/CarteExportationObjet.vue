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
        <v-card-title class="d-flex align-center">
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
        <OptionsFormatExportation v-model="formatDoc" />
        <OptionsLanguesExportation v-model="langues" />
        <OptionsDocumentsExportation v-model="inclureDocuments" />
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
import type {automatisation} from '@constl/ipa';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ref} from 'vue';
import {useDisplay} from 'vuetify';
import {isElectronRenderer} from 'wherearewe';

import OptionsDocumentsExportation from './OptionsDocumentsExportation.vue';
import OptionsFormatExportation from './OptionsFormatExportation.vue';
import OptionsLanguesExportation from './OptionsLanguesExportation.vue';

import {utiliserConstellation} from '/@/components/utils';
import {choisirFichierSauvegarde} from '/@/utils';

const props = defineProps<{
  idObjet: string;
  typeObjet: 'nuée' | 'projet' | 'bd' | 'tableau';
  nomsObjet?: {[langue: string]: string};
}>();

const {mdAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);

// Format
const formatDoc = ref<automatisation.formatTélécharger>('ods');
const langues = ref<string[] | undefined>();
const inclureDocuments = ref<boolean>();

// Télécharger
const enTéléchargement = ref(false);

const télécharger = async () => {
  const langueNom = langues.value?.find(lng => props.nomsObjet?.[lng]);
  const ext = inclureDocuments.value ? 'zip' : formatDoc.value;

  const dossier = await choisirFichierSauvegarde({
    defaultPath: `${langueNom ? props.nomsObjet?.[langueNom] : props.idObjet}.${ext}`,
    filters: [{extensions: [ext], name: ''}],
  });

  // Sur le navigateur, on ne choisi pas le fichier de téléchargement
  if (isElectronRenderer && !dossier) return;

  enTéléchargement.value = true;
  switch (props.typeObjet) {
    case 'tableau': {
      await constl.tableaux.exporterTableauÀFichier({
        idTableau: props.idObjet,
        dossier,
        formatDoc: formatDoc.value,
        langues: langues.value,
        inclureDocuments: inclureDocuments.value,
      });
      break;
    }
    case 'bd': {
      await constl.bds.exporterBdÀFichier({
        idBd: props.idObjet,
        dossier,
        formatDoc: formatDoc.value,
        langues: langues.value,
        inclureDocuments: inclureDocuments.value,
      });
      break;
    }
    case 'nuée': {
      await constl.nuées.exporterNuéeÀFichier({
        idNuée: props.idObjet,
        dossier,
        formatDoc: formatDoc.value,
        langues: langues.value,
        inclureDocuments: inclureDocuments.value,
      });
      break;
    }
    case 'projet': {
      await constl.projets.exporterProjetÀFichier({
        idProjet: props.idObjet,
        dossier,
        formatDoc: formatDoc.value,
        langues: langues.value,
        inclureDocuments: inclureDocuments.value,
      });
      break;
    }
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
