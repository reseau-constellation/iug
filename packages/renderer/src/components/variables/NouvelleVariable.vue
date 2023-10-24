<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props}">
      <slot
        name="activator"
        v-bind="{props}"
      ></slot>
    </template>

    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="text-h5 justify-space-between">
          <span>{{ titreCarte }}</span>
        </v-card-title>
        <v-card-subtitle> {{ sousTitreCarte }} </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <v-window
          v-model="étape"
          style="overflow-y: scroll"
        >
          <v-window-item :value="0">
            <v-select
              v-model="catégorieBase"
              :items="catégoriesBase"
              :label="t('variables.nouvelle.catégorie')"
              variant="outlined"
            >
              <template #item="{item, props: propsItem}">
                <v-list-item
                  v-bind="propsItem"
                  :title="t(`variables.catégories.${item.raw}`)"
                  :subtitle="t(`variables.indicesCatégories.${item.raw}`)"
                  :prepend-icon="
                    icôneCatégorieVariable({type: 'simple', catégorie: item.raw}) || 'mdi-variable'
                  "
                />
              </template>
            </v-select>
            <v-checkbox
              v-model="catégorieListe"
              :label="t('variables.nouvelle.typeListe')"
            />
          </v-window-item>
          <v-window-item :value="1">
            <liste-noms
              :texte-aucun-nom="t('communs.texteAucunNom')"
              :indice-langue="t('communs.indiceLangue')"
              :indice-nom="t('communs.indiceNom')"
              :noms-initiaux="noms"
              :autorisation-modification="true"
              @ajuster-noms="ajusterNoms"
            />
          </v-window-item>
          <v-window-item :value="2">
            <liste-noms
              :texte-aucun-nom="t('variables.nouvelle.texteAucuneDescription')"
              :indice-langue="t('communs.indiceLangue')"
              :indice-nom="t('variables.nouvelle.texteIndiceDescription')"
              :noms-initiaux="descriptions"
              :autorisation-modification="true"
              @ajuster-noms="ajusterDescriptions"
            />
          </v-window-item>
          <v-window-item :value="3">
            <v-text-field
              v-model="unités"
              variant="outlined"
            />
          </v-window-item>
          <v-window-item :key="4">
            <div class="text-center">
              <h3 class="text-h6 font-weight-light mb-2">
                {{ t('variables.nouveau.texteCréer') }}
              </h3>
              <p>
                <v-btn
                  class="mt-3"
                  variant="outlined"
                  :loading="enCréation"
                  @click="() => créerVariable()"
                >
                  {{ t('variables.nouveau.texteBtnCréation') }}
                </v-btn>
              </p>
            </div>
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
import type {variables} from '@constl/ipa';
import type {ClientConstellation} from '@constl/ipa';

import {computed, inject, ref} from 'vue';
import {useDisplay} from 'vuetify';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import ListeNoms from '/@/components/communs/listeNoms/ListeNoms.vue';
import {icôneCatégorieVariable} from '/@/components/variables/utils';

import {catégoriesBase} from './utils';

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = ['catégorie', 'noms', 'descriptions', 'unités', 'confirmation'] as const;

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'catégorie':
      return t('variables.nouvelle.titreCatégorie');
    case 'noms':
      return t('variables.nouvelle.titreNoms');
    case 'descriptions':
      return t('variables.nouvelle.titreDescriptions');
    case 'unités':
      return t('variables.nouvelle.titreUnités');
    case 'confirmation':
      return t('variables.nouvelle.titreConfirmation');
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'catégorie':
      return t('variables.nouvelle.sousTitreCatégorie');
    case 'noms':
      return t('variables.nouvelle.sousTitreNoms');
    case 'descriptions':
      return t('variables.nouvelle.sousTitreDescriptions');
    case 'unités':
      return t('variables.nouvelle.sousTitreUnités');
    case 'confirmation':
      return t('variables.nouvelle.sousTitreConfirmation');
    default:
      return '';
  }
});

const retour = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'confirmation':
      étape.value = listeÉtapes.indexOf(unitésPossible.value ? 'unités' : 'descriptions');
      break;
    default:
      étape.value--;
      break;
  }
};

const suivant = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'descriptions':
      étape.value = listeÉtapes.indexOf(unitésPossible.value ? 'unités' : 'confirmation');
      break;
    default:
      étape.value++;
      break;
  }
};

const suivantActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'catégorie':
      return {actif: !!catégorieBase.value, visible: true};
    case 'noms':
      return {actif: !!Object.keys(noms.value).length, visible: true};
    case 'confirmation':
      return {actif: false, visible: false};
    default:
      return {actif: true, visible: true};
  }
});

const retourActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return {actif: false, visible: false};
    case 'confirmation':
      return {actif: !enCréation.value, visible: true};
    default:
      return {actif: true, visible: true};
  }
});

// Catégorie
const catégorieListe = ref(false);
const catégorieBase = ref<variables.catégorieBaseVariables>();
const catégorie = computed<variables.catégorieVariables | undefined>(() => {
  if (!catégorieBase.value) return;
  return {type: catégorieListe.value ? 'liste' : 'simple', catégorie: catégorieBase.value};
});

// Noms
const noms = ref<{[lng: string]: string}>({});
const ajusterNoms = (nms: {[lng: string]: string}) => {
  noms.value = nms;
};

// Descriptions
const descriptions = ref<{[lng: string]: string}>({});
const ajusterDescriptions = (desrc: {[lng: string]: string}) => {
  descriptions.value = desrc;
};

// Unités
const unités = ref<string>();
const unitésPossible = computed(() => {
  return catégorieBase.value === 'numérique';
});

// Création
const enCréation = ref(false);
const créerVariable = async () => {
  enCréation.value = true;

  if (!catégorie.value) return;

  const idVariable = await constl?.variables.créerVariable({catégorie: catégorie.value});
  if (!idVariable) throw new Error('Variable non créée.');

  await constl?.variables.sauvegarderNomsVariable({
    idVariable,
    noms: Object.fromEntries(Object.entries(noms.value)),
  });
  await constl?.variables.sauvegarderDescriptionsVariable({
    idVariable,
    descriptions: Object.fromEntries(Object.entries(descriptions.value)),
  });

  if (unités.value) {
    await constl?.variables.sauvegarderUnitésVariable({idVariable, idUnité: unités.value});
  }

  fermer();
};

// Fermer
const fermer = () => {
  noms.value = {};
  descriptions.value = {};
  étape.value = 0;
  enCréation.value = false;
  dialogue.value = false;
};
</script>
