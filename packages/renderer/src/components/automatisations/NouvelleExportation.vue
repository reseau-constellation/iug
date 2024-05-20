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
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex">
          {{ t(titreCarte) }}
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
        <v-window
          v-model="étape"
          style="overflow-y: scroll"
        >
          <v-window-item :value="étapes.indexOf('objetConstellation')">
            <v-chip-group
              v-model="typeObjet"
              color="primary"
              mandatory
            >
              <v-chip
                v-for="type in ['tableau', 'bd', 'projet', 'nuée']"
                :key="type"
                :text="t(`pages.mesDonnées.${type}s`)"
                class="mx-2"
                variant="outlined"
                :prepend-icon="icôneObjet(type)"
              />
            </v-chip-group>
            <SelecteurBd
              v-if="typeObjet === 'bd'"
              :multiples="false"
              @selectionnee="bds => (idObjet = bds[0])"
            />
            <SelecteurTableau
              v-else-if="typeObjet === 'tableau'"
              :multiples="false"
              @selectionne="tableau => (idObjet = tableau)"
            />
            <SelecteurProjet
              v-else-if="typeObjet === 'projet'"
              :multiples="false"
              @selectionne="projets => (idObjet = projets[0])"
            />
            <SelecteurNuee
              v-else-if="typeObjet === 'nuée'"
              :multiples="false"
              @selectionnee="nuées => (idObjet = nuées[0])"
            />
          </v-window-item>
          <v-window-item :value="étapes.indexOf('destination')">
            <v-text-field
              v-model="destination"
              variant="outlined"
              prepend-icon="mdi-folder-outline"
              clearable
              @click="choisirDestination"
            ></v-text-field>
          </v-window-item>
          <v-window-item :value="étapes.indexOf('format')">
            <v-select
              v-model="formatDoc"
              :items="optionsFormatsDoc"
              variant="outlined"
            ></v-select>
            <v-autocomplete
              v-model="langues"
              :items="languesDisponibles"
              variant="outlined"
              multiple
              chips
              closable-chips
            >
            </v-autocomplete>
            <v-checkbox
              v-model="inclureDocuments"
              color="primary"
            ></v-checkbox>
          </v-window-item>
          <v-window-item :value="étapes.indexOf('automatiser')">
          </v-window-item>
          <v-window-item :value="étapes.indexOf('confirmation')">
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-card-actions>
        <v-btn
          v-show="retourActif.visible"
          variant="text"
          :disabled="!retourActif.actif"
          @click="retour"
        >
          {{ t('communs.retour') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-show="suivantActif.visible"
          color="primary"
          variant="flat"
          :disabled="!suivantActif.actif"
          @click="suivant"
        >
          {{ t('communs.suivant') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type { automatisation } from '@constl/ipa';

import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';
import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import {choisirDossier} from '#preload';

import SelecteurBd from '/@/components/bds/SélecteurBd.vue';
import SelecteurTableau from '/@/components/tableaux/SélecteurTableau.vue';
import SelecteurProjet from '/@/components/projets/SélecteurProjet.vue';
import SelecteurNuee from '/@/components/nuées/SélecteurNuée.vue';
import { icôneObjet } from '../utils';

import { isBrowser } from 'wherearewe';
import { watchEffect } from 'vue';


const props = defineProps<{infoObjet?: {
  id: string; typeObjet: 'tableau' | 'bd' | 'projet' | 'nuée' }
}>();

const {mdAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து, கிடைக்கும்_மொழிகளை_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const {மொழி, மாற்றுமொழிகள்} = மொழிகளைப்_பயன்படுத்து();
const {மொழிகளும்_குறியீடுகளும்} = கிடைக்கும்_மொழிகளை_பயன்படுத்து();

// Navigation
const dialogue = ref(false);
const étapes = [
  'objetConstellation',
  'destination',
  'format',
  'automatiser',
  'confirmation',
] as const;

const étape = ref(étapes.indexOf(props.infoObjet ? (isBrowser ? 'format' : 'destination') : 'objetConstellation'));

const titreCarte = computed(() => {
  const é = étapes[étape.value];
  switch (é) {
    case 'objetConstellation':
      return 'exportations.carte.titreObjetConstellation';
    case 'destination':
      return 'exportations.carte.titreDestination';
    case 'format':
      return 'exportations.carte.titreFormat';
    case 'automatiser':
      return 'exportations.carte.titreAutomatiser';
    case 'confirmation':
      return 'exportations.carte.titreConfirmation';
    default:
      return '';
  }
});

const suivant = () => {
  const é = étapes[étape.value];
  switch (é) {
    case 'objetConstellation':
      étape.value = étapes.indexOf(isBrowser ? 'format' : 'destination');
      break;

    default:
      étape.value++;
      break;
  }
};

const retour = () => {
  const é = étapes[étape.value];
  switch (é) {
    case 'format':
      étape.value = étapes.indexOf(isBrowser ? 'objetConstellation' : 'destination');
      break;

    default:
      étape.value--;
      break;
  }
};

const suivantActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = étapes[étape.value];
  switch (é) {
    case 'objetConstellation':
      return {actif: !!idObjet.value, visible: true};
    case 'destination':
      return {actif: !!destination.value, visible: true};
    case 'confirmation':
      return {actif: false, visible: false};
    default:
      return {actif: true, visible: true};
  }
});

const retourActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = étapes[étape.value];
  switch (é) {
    case 'objetConstellation':
      return {actif: false, visible: false};
    case 'destination':
      return {actif: !props.infoObjet, visible: !props.infoObjet};
    case 'format':
      return {actif: !props.infoObjet || !isBrowser, visible: !props.infoObjet || !isBrowser};
    case 'confirmation':
      return {actif: !enCréation.value, visible: true};
    default:
      return {actif: true, visible: true};
  }
});

// Objet Constellation
const typeObjet = ref(props.infoObjet?.typeObjet);
const idObjet = ref(props.infoObjet?.id);

// Destination
const destination = ref<string>();
const choisirDestination = async () => {
  if (destination.value === '') {
    destination.value = await choisirDossier();
  }
};

// Format
const formatDoc = ref<automatisation.formatTélécharger>();
const optionsFormatsDoc = ['xlsx', 'xls','ods', 'csv', 'txt', 'rtf'];

const langues = ref();
const languesDisponibles = computed(()=>மொழிகளும்_குறியீடுகளும்.value.map(lng=>lng.மொழி));
watchEffect(()=>{
  langues.value = [மொழி.value, ...மாற்றுமொழிகள்.value].map(code => மொழிகளும்_குறியீடுகளும்.value.find(lng=>lng.குறியீடு === code)?.மொழி || code);
});

const inclureDocuments = ref(true);

// Confirmation
const enCréation = ref(false);

</script>
