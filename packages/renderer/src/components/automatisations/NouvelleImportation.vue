<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      />
    </template>
    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex align-center">
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
                v-for="type in ['tableau', 'bd']"
                :key="type"
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
              :id-bd="idBd"
              @selectionne="tableau => (idObjet = tableau)"
            />
          </v-window-item>
          <v-window-item :value="étapes.indexOf('sourceImportation')">
            <v-file-input
              v-model="fichier"
              class="mt-2"
              variant="outlined"
              :label="t('importations.carte.étiquetteFichier')"
            ></v-file-input>
            <v-text-field
              v-model="url"
              prepend-icon="mdi-web"
              variant="outlined"
              :label="t('importations.carte.étiquetteURL')"
            ></v-text-field>
            {{ url }}
            {{ donnéesSource }}
          </v-window-item>
          <v-window-item :value="étapes.indexOf('correspondancesImportation')"></v-window-item>
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
                :disabled="!!url || isBrowser"
              >
                <template #label>
                  <div>
                    <p class="font-weight-bold">{{ t('automatisations.fréquence.dynamique') }}</p>
                    <p class="text-medium-emphasis text-caption">
                      {{ t('automatisations.fréquence.indiceDynamique') }}
                    </p>
                    <p
                      v-if="!!url"
                      class="my-1 text-medium-emphasis text-caption"
                    >
                      <v-icon
                        icon="mdi-alert-outline"
                        start
                      />{{ t('automatisations.fréquence.pasDeSourceURL') }}
                    </p>
                    <p
                      v-else-if="isBrowser"
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
                    <p class="text-medium-emphasis text-caption"></p>
                    <div class="d-flex vertical-align">
                      <div
                        class="text-medium-emphasis text-caption"
                        style="display: flex; align-items: center"
                      >
                        {{ t('automatisations.fréquence.indiceFixe') }}
                      </div>
                      <v-text-field
                        v-model="choixFréquence"
                        class="mx-1"
                        variant="outlined"
                        density="compact"
                        hide-details
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
          </v-window-item>
          <v-window-item :value="étapes.indexOf('confirmation')"></v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';

import axios from 'axios';

import {icôneObjet} from '../utils';
import SelecteurBd from '/@/components/bds/SélecteurBd.vue';
import SelecteurTableau from '/@/components/tableaux/SélecteurTableau.vue';

import {isBrowser} from 'wherearewe';

const props = defineProps<{
  infoObjet?: {id: string; typeObjet: 'bd' | 'tableau'};
  idBd?: string; // Pour la sélection de tableaux
}>();

const {mdAndUp} = useDisplay();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

// Navigation
const dialogue = ref(false);
const étapes = [
  'objetConstellation',
  'sourceImportation',
  'correspondancesImportation',
  'automatiser',
  'confirmation',
] as const;

const étape = ref(étapes.indexOf(props.infoObjet ? 'sourceImportation' : 'objetConstellation'));

const titreCarte = computed(() => {
  const é = étapes[étape.value];
  switch (é) {
    case 'objetConstellation':
      return 'importations.carte.titreObjetConstellation';
    case 'sourceImportation':
      return 'importations.carte.titreSourceImportation';
    case 'correspondancesImportation':
      return 'importations.carte.titreCorrespondancesImportation';
    case 'confirmation':
      return 'importations.carte.titreconfirmation';
    default:
      return '';
  }
});

// Objet Constellation
const typeObjet = ref(props.infoObjet?.typeObjet);
const idObjet = ref(props.infoObjet?.id);

// Source
const fichier = ref<File[]>();
const url = ref<string>();

watchEffect(() => {
  if (fichier.value) url.value = undefined;
});
watchEffect(() => {
  if (url.value) fichier.value = undefined;
});

const donnéesSource = ref<Uint8Array>();
const formatSource = ref<string>();

const erreurURL = ref(false);

watchEffect(() => {
  const nomDocument = fichier.value?.[0].name || url.value;
  formatSource.value = nomDocument?.split('.').pop();
});
watchEffect(async () => {
  if (url.value) {
    try {
      const réponse = await axios.get(url.value);
      donnéesSource.value = réponse.data;
    } catch {
      erreurURL.value = true;
    }
  } else if (fichier.value) {
    donnéesSource.value = new Uint8Array(await fichier.value[0].arrayBuffer());
  } else {
    donnéesSource.value = undefined;
  }
});

// Automatisation
const optionAutomatiser = ref<'aucune' | 'manuelle' | 'dynamique' | 'fixe'>('manuelle');

const choixFréquence = ref(1);
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
</script>
