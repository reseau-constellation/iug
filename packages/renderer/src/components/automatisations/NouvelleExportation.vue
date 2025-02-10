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
      :width="mdAndUp ? 600 : '90%'"
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
      <v-card-text style="overflow-y: auto">
        <v-window
          v-model="étape"
          style="overflow-y: scroll"
          disabled
        >
          <v-window-item :value="étapes.indexOf('objetConstellation')">
            <v-chip-group
              v-model="typeObjet"
              color="primary"
              mandatory
            >
              <v-chip
                v-for="jeton in jetonsTypesDonnées"
                :key="jeton.type"
                :value="jeton.type"
                :text="t(jeton.texte)"
                class="mx-2"
                variant="outlined"
                :prepend-icon="icôneObjet(jeton.type)"
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
              :label="t('exportations.carte.étiquetteDestination')"
              class="mt-2"
              variant="outlined"
              prepend-icon="mdi-folder-outline"
              density="compact"
              clearable
              @click="() => choisirDestination()"
            ></v-text-field>
          </v-window-item>
          <v-window-item :value="étapes.indexOf('format')">
            <v-select
              v-model="formatDoc"
              :items="optionsFormatsDoc"
              :label="t('exportations.carte.étiquetteFormatDoc')"
              class="mt-2"
              variant="outlined"
            >
              <template #selection="{item}">
                {{ t(`exportations.format.${item.raw}`) }}
              </template>
              <template #item="{item, props: propsItem}">
                <v-list-item
                  v-bind="propsItem"
                  :title="t(`exportations.format.${item.raw}`)"
                >
                </v-list-item>
              </template>
            </v-select>
            <OptionsLanguesExportation v-model="langues" />
            <v-checkbox
              v-model="inclureDocuments"
              color="primary"
            >
              <template #label>
                {{ t('exportations.carte.étiquetteInclureDocuments') }}
                <v-tooltip
                  v-if="!écranTactile"
                  location="bottom"
                  :text="t('exportations.carte.indiceInclureDocuments')"
                >
                  <template #activator="{props: propsActivateur}">
                    <v-icon
                      v-bind="propsActivateur"
                      icon="mdi-information-outline"
                      end
                    ></v-icon>
                  </template>
                </v-tooltip>
              </template>
            </v-checkbox>
          </v-window-item>
          <v-window-item :value="étapes.indexOf('automatiser')">
            <p>{{ t('exportations.carte.automatiser') }}</p>
            <v-radio-group v-model="optionAutomatiser">
              <v-radio
                value="manuelle"
                class="my-2"
              >
                <template #label>
                  <div>
                    <p class="font-weight-bold">{{ t('automatisations.fréquence.manuelle') }}</p>
                    <p class="text-medium-emphasis text-caption">
                      {{ t('automatisations.fréquence.indiceManuelle') }}
                    </p>
                  </div>
                </template>
              </v-radio>
              <v-radio
                value="dynamique"
                class="my-2"
                :disabled="isBrowser"
              >
                <template #label>
                  <div>
                    <p class="font-weight-bold">{{ t('automatisations.fréquence.dynamique') }}</p>
                    <p class="text-medium-emphasis text-caption">
                      {{ t('automatisations.fréquence.indiceDynamique') }}
                    </p>
                    <p
                      v-if="isBrowser"
                      class="my-1 text-medium-emphasis text-caption"
                    >
                      <v-icon
                        icon="mdi-alert-outline"
                        start
                      />{{ t('automatisations.fréquence.pasSurNavig') }}
                    </p>
                  </div>
                </template>
              </v-radio>
              <v-radio
                value="fixe"
                class="my-2"
                :disabled="isBrowser"
              >
                <template #label>
                  <div>
                    <p class="font-weight-bold">{{ t('automatisations.fréquence.fixe') }}</p>
                    <p class="text-medium-emphasis text-caption"> </p>
                    <div :class="{'d-flex': mdAndUp}">
                      <div
                        class="text-medium-emphasis text-caption"
                        style="display: flex; align-items: center"
                      >
                        {{ t('automatisations.fréquence.indiceFixe') }}
                      </div>
                      <div class="d-flex">
                        <v-text-field
                          v-model="choixFréquence"
                          class="mx-1"
                          variant="outlined"
                          density="compact"
                          :hide-details="règleNumérique(choixFréquence) === true && règleEntierPositif() === true"
                          :rules="[règleNumérique, règleEntierPositif]"
                        />
                        <v-select
                          v-model="choixUnitéFréquence"
                          :items="optionsUnitésFréquence"
                          class="mx-1"
                          variant="outlined"
                          density="compact"
                          hide-details
                        >
                          <template #selection="{item}">
                            {{ t(`automatisations.fréquence.unités.${item.raw}`) }}
                          </template>
                          <template #item="{item, props: propsItem}">
                            <v-list-item
                              v-bind="propsItem"
                              :title="t(`automatisations.fréquence.unités.${item.raw}`)"
                            />
                          </template>
                        </v-select>
                      </div>
                    </div>
                    <p
                      v-if="isBrowser"
                      class="my-1 text-medium-emphasis text-caption"
                    >
                      <v-icon
                        icon="mdi-alert-outline"
                        start
                      />{{ t('automatisations.fréquence.pasSurNavig') }}
                    </p>
                  </div>
                </template>
              </v-radio>
              <v-radio
                value="aucune"
                class="my-2"
              >
                <template #label>
                  <div>
                    <p class="font-weight-bold">{{ t('automatisations.fréquence.aucune') }}</p>
                    <p class="text-medium-emphasis text-caption">
                      {{ t('automatisations.fréquence.indiceAucune') }}
                    </p>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
            <v-expand-transition>
              <div v-show="optionAutomatiser === 'dynamique' || optionAutomatiser === 'fixe'">
                <p class="my-2">{{ t('exportations.carte.copies') }}</p>
                <OptionsSauvegardesMultiples v-model="sauvegardes" />
              </div>
            </v-expand-transition>
          </v-window-item>
          <v-window-item
            :value="étapes.indexOf('confirmation')"
            class="text-center"
          >
            <v-btn
              append-icon="mdi-check"
              variant="outlined"
              @click="() => exporter()"
            >
              {{ t('exportations.carte.confirmer') }}
            </v-btn>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <btn-retour
          :visible="retourActif.visible"
          :actif="retourActif.actif"
          @retour="retour"
        />
        <v-spacer></v-spacer>
        <btn-suivant
          :visible="suivantActif.visible"
          :actif="suivantActif.actif"
          @suivant="suivant"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';

import {எண்ணிக்கையை_கண்டுப்பிடி, கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {icôneObjet, utiliserConstellation} from '../utils';
import OptionsSauvegardesMultiples from './OptionsSauvegardesMultiples.vue';
import OptionsLanguesExportation from './OptionsLanguesExportation.vue';
import SelecteurBd from '/@/components/bds/SélecteurBd.vue';
import BtnRetour from '/@/components/communs/BtnRetour.vue';
import BtnSuivant from '/@/components/communs/BtnSuivant.vue';
import SelecteurNuee from '/@/components/nuées/SélecteurNuée.vue';
import SelecteurProjet from '/@/components/projets/SélecteurProjet.vue';
import SelecteurTableau from '/@/components/tableaux/SélecteurTableau.vue';

import {isBrowser} from 'wherearewe';
import {choisirDossier, plateforme} from '/@/utils';
import { cloneDeep } from 'lodash-es';

const props = defineProps<{
  infoObjet?: {
    id: string;
    typeObjet: 'tableau' | 'bd' | 'projet' | 'nuée';
  };
}>();

const {mdAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const எண்ணிக்கை = எண்ணிக்கையை_கண்டுப்பிடி();

const {so} = plateforme();
const écranTactile = so === 'androïde' || so === 'iOS';

const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);
const étapes = [
  'objetConstellation',
  'destination',
  'format',
  'automatiser',
  'confirmation',
] as const;

const étape = ref(
  étapes.indexOf(props.infoObjet ? (isBrowser ? 'format' : 'destination') : 'objetConstellation'),
);

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
    case 'format':
      return {actif: !!formatDoc.value, visible: true};
    case 'automatiser':
      return {actif: !!optionAutomatiser.value, visible: true};
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
const typeObjet = ref(props.infoObjet?.typeObjet || 'bd');
const idObjet = ref(props.infoObjet?.id);
const jetonsTypesDonnées = [
  { type: 'tableau', texte: 'pages.mesDonnées.tableaux'},
  { type: 'bd', texte: 'pages.mesDonnées.bds' },
  { type: 'projet', texte: 'pages.mesDonnées.projets' },
  { type: 'nuée', texte: 'pages.mesDonnées.nuées' },
];

// Destination
const destination = ref<string>();
const choisirDestination = async () => {
  if (destination.value === '' || !destination.value) {
    destination.value = await choisirDossier();
  }
};

// Format
const formatDoc = ref<automatisation.formatTélécharger>('ods');
const optionsFormatsDoc = ['ods', 'csv', 'txt', 'xlsx', 'xls'];

const langues = ref<string[]>();
const inclureDocuments = ref(true);

// Automatisation
const optionAutomatiser = ref<'aucune' | 'manuelle' | 'dynamique' | 'fixe'>(isBrowser ? 'manuelle' : 'fixe');

const choixFréquence = ref('1');
const choixFréquenceNumérique = computed(()=>{
  try {
    return எண்ணிக்கை.எண்ணுக்கு({உரை: choixFréquence.value});
  } catch {
    return undefined;
  }
});
const choixUnitéFréquence = ref<automatisation.fréquenceFixe['détails']['unités']>('jours');
const optionsUnitésFréquence: automatisation.fréquenceFixe['détails']['unités'][] = [
  'années',
  'mois',
  'semaines',
  'jours',
  'heures',
  'minutes',
  'secondes',
  'millisecondes',
];

const règleNumérique = (val: string) => {
  try {
    எண்ணிக்கை.எண்ணுக்கு({உரை: val});
    return true;
  } catch {
    return t('règles.numérique');
  }
};
const entier = (x: number): boolean => (x | 0) === x;
const règleEntierPositif = () => {
  return (choixFréquenceNumérique.value !== undefined && choixFréquenceNumérique.value > 0 && entier(choixFréquenceNumérique.value)) ? true : t('règles.nombreEntierPositif');
};

const sauvegardes = ref<automatisation.copiesExportation>();

// Confirmation
const enCréation = ref(false);
const exporter = async () => {
  if (!destination.value || !idObjet.value || !typeObjet.value) return;

  if (optionAutomatiser.value === 'aucune') {
    if (typeObjet.value === 'tableau') {
      await constl.tableaux.exporterTableauÀFichier(cloneDeep({
        idTableau: idObjet.value,
        langues: langues.value,
        formatDoc: formatDoc.value,
        dossier: destination.value,
        inclureDocuments: inclureDocuments.value,
      }));
    } else if (typeObjet.value === 'bd') {
      await constl.bds.exporterBdÀFichier(cloneDeep({
        idBd: idObjet.value,
        langues: langues.value,
        formatDoc: formatDoc.value,
        dossier: destination.value,
        inclureDocuments: inclureDocuments.value,
      }));
    } else if (typeObjet.value === 'nuée') {
      await constl.nuées.exporterNuéeÀFichier(cloneDeep({
        idNuée: idObjet.value,
        langues: langues.value,
        formatDoc: formatDoc.value,
        dossier: destination.value,
        inclureDocuments: inclureDocuments.value,
      }));
    } else if (typeObjet.value === 'projet') {
      await constl.projets.exporterProjetÀFichier(cloneDeep({
        idProjet: idObjet.value,
        langues: langues.value,
        formatDoc: formatDoc.value,
        dossier: destination.value,
        inclureDocuments: inclureDocuments.value,
      }));
    }
  } else {
    if (!choixFréquenceNumérique.value) return;
    await constl.automatisations.ajouterAutomatisationExporter(cloneDeep({
      id: idObjet.value,
      typeObjet: typeObjet.value,
      formatDoc: formatDoc.value,
      inclureDocuments: inclureDocuments.value,
      dossier: destination.value,
      langues: langues.value,
      fréquence: {
        type: optionAutomatiser.value,
        détails: {
          n: choixFréquenceNumérique.value,
          unités: choixUnitéFréquence.value,
        },
      },
      copies: sauvegardes.value,
    }));
  }
  fermer();
};
const fermer = () => {
  dialogue.value=false;
};
</script>
