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
        <v-card-title class="d-flex align-center">
          {{ t('automatisations.exportation.titreCarte') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          ></v-btn>
        </v-card-title>
      </v-card-item>
      <v-card-text style="overflow-y: scroll">
        <division-carte
          :titre="t('automatisations.exportation.sousSections.statut')"
          :en-attente="false"
        />
        <item-statut-automatisation
          v-if="statut"
          :statut="statut"
          :spécification="spécification"
        />
        <jeton-fichier-exportation
          v-if="monDispositif && spécification.dispositifs.includes(monDispositif)"
          class="my-2"
          :spécification="spécification"
          @click="() => changerFichierExportation()"
        />
        <division-carte
          :titre="t('automatisations.exportation.sousSections.format')"
          :en-attente="false"
        />
        <OptionsFormatExportation v-model="formatDoc" />
        <OptionsLanguesExportation v-model="langues" />
        <OptionsDocumentsExportation v-model="inclureDocuments" />
        <division-carte
          :titre="t('automatisations.exportation.sousSections.fréquence')"
          :en-attente="false"
        />
        <OptionsFrequenceExportation v-model="fréquence" />
        <OptionsSauvegardesMultiples v-model="copies" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <btn-annuler @click="dialogue = false" />
        <btn-sauvegarder
          :actif="modifié"
          @click="() => sauvegarder()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';

import {ref} from 'vue';
import {useDisplay} from 'vuetify';

import {obt, suivre} from '@constl/vue';
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import deepEqual from 'deep-equal';
import {computed} from 'vue';
import DivisionCarte from '../communs/DivisionCarte.vue';
import ItemStatutAutomatisation from './ItemStatutAutomatisation.vue';
import JetonFichierExportation from './JetonFichierExportation.vue';
import OptionsDocumentsExportation from './OptionsDocumentsExportation.vue';
import OptionsFormatExportation from './OptionsFormatExportation.vue';
import OptionsFrequenceExportation from './OptionsFréquenceExportation.vue';
import OptionsLanguesExportation from './OptionsLanguesExportation.vue';
import OptionsSauvegardesMultiples from './OptionsSauvegardesMultiples.vue';
import BtnAnnuler from '/@/components/communs/BtnAnnuler.vue';
import BtnSauvegarder from '/@/components/communs/BtnSauvegarder.vue';
import {utiliserConstellation} from '/@/components/utils';
import {choisirFichierSauvegarde} from '/@/utils';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

const props = defineProps<{
  spécification: automatisation.SpécificationExporter;
  objetModifiable: boolean;
}>();

const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);

// Dispositif
const monDispositif = obt(constl.obtIdDispositif);

// Statut
const statuts = suivre(constl.automatisations.suivreÉtatAutomatisations);
const statut = computed(() => statuts.value?.[props.spécification.id]);

// Modifications
const langues = ref(props.spécification.langues);
const dossier = ref(props.spécification.dossier);
const fréquence = ref(props.spécification.fréquence);
const formatDoc = ref(props.spécification.formatDoc);
const inclureDocuments = ref(props.spécification.inclureDocuments);
const copies = ref(props.spécification.copies);
const dispositifs = ref(props.spécification.dispositifs);

const spécificationExportation = computed<automatisation.SpécificationExporter>(() => {
  const spécification: automatisation.SpécificationExporter = {
    id: props.spécification.id,
    type: 'exportation',
    fréquence: fréquence.value,
    idObjet: props.spécification.idObjet,
    typeObjet: props.spécification.typeObjet,
    formatDoc: formatDoc.value,
    dossier: dossier.value,
    langues: langues.value,
    dispositifs: dispositifs.value,
    inclureDocuments: inclureDocuments.value,
    copies: copies.value,
  };
  return spécification;
});

const changerFichierExportation = async () => {
  const fichier = await choisirFichierSauvegarde();
  if (fichier) dossier.value = fichier;
};

// Sauvegarde
const modifié = computed(() => !deepEqual(spécificationExportation.value, props.spécification));
const sauvegarder = async () => {
  if (!modifié.value) return;

  await constl.automatisations.modifierAutomatisation({
    id: props.spécification.id,
    automatisation: spécificationExportation.value,
  });
};
</script>
