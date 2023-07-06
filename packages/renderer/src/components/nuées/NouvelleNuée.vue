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
        <v-card-title class="d-flex">
          {{ titreCarte }}
          <v-spacer />
          <v-btn
            variant="flat"
            size="small"
            icon="mdi-close"
            @click="fermer"
          />
        </v-card-title>
        <v-card-subtitle> {{ sousTitreCarte }} </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <v-window
          v-model="étape"
          style="overflow-y: scroll"
        >
          <v-window-item :key="0">
            <liste-noms
              :texte-aucun-nom="t('communs.texteAucunNom')"
              :indice-langue="t('communs.indiceLangue')"
              :indice-nom="t('communs.indiceNom')"
              :noms-initiaux="noms"
              :autorisation-modification="true"
              @ajuster-noms="ajusterNoms"
            />
          </v-window-item>
          <v-window-item :key="1">
            <liste-noms
              :texte-aucun-nom="t('nuées.nouvelle.texteAucuneDescription')"
              :indice-langue="t('communs.indiceLangue')"
              :indice-nom="t('nuées.nouvelle.texteIndiceDescription')"
              :noms-initiaux="descriptions"
              :autorisation-modification="true"
              @ajuster-noms="ajusterDescriptions"
            />
          </v-window-item>
          <v-window-item :key="2">
            <v-radio-group>
              <v-radio
                value="CJPI"
                class="my-2"
              >
                <template #label>
                  <div>
                    <p class="font-weight-bold">{{ t('nuées.nouvelle.parInvitation') }}</p>
                    <p class="text-medium-emphasis text-caption">
                      {{ t('nuées.nouvelle.indiceParInvitation') }}
                    </p>
                  </div>
                </template>
              </v-radio>
              <v-radio
                value="IJPC"
                class="my-2"
              >
                <template #label>
                  <div>
                    <p class="font-weight-bold">{{ t('nuées.nouvelle.ouverteÀTous') }}</p>
                    <p class="text-medium-emphasis text-caption">
                      {{ t('nuées.nouvelle.indiceOuverteÀTous') }}
                    </p>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </v-window-item>
          <v-window-item :key="3">
            <div class="text-center">
              <h3 class="text-h6 font-weight-light mb-2">
                {{ t('nuées.nouvelle.texteCréer') }}
              </h3>
              <p>
                <v-btn
                  class="mt-3"
                  variant="outlined"
                  :loading="enCréation"
                  @click="() => créerNuée()"
                >
                  {{ t('nuées.nouvelle.texteBtnCréation') }}
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
import type {client} from '@constl/ipa';

import {computed, inject, ref} from 'vue';
import {useDisplay} from 'vuetify';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import ListeNoms from '../communs/listeNoms/ListeNoms.vue';

const {mdAndUp} = useDisplay();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const constl = inject<client.ClientConstellation>('constl');

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = ['noms', 'descriptions', 'autorisation', 'confirmation'] as const;

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return t('nuées.nouvelle.titreNoms');
    case 'descriptions':
      return t('nuées.nouvelle.titreDescriptions');
    case 'autorisation':
      return t('nuées.nouvelle.titreAutorisation');
    case 'confirmation':
      return t('nuées.nouvelle.titreConfirmation');
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return t('nuées.nouvelle.sousTitreNoms');
    case 'descriptions':
      return t('nuées.nouvelle.sousTitreDescriptions');
    case 'autorisation':
      return t('nuées.nouvelle.sousTitreAutorisation');
    case 'confirmation':
      return t('nuées.nouvelle.sousTitreConfirmation');
    default:
      return '';
  }
});

const retour = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      étape.value--;
      break;
  }
};

const suivant = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      étape.value++;
      break;
  }
};

const suivantActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
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

// Autorisation
const autorisation = ref<'CJPI' | 'IJPC'>('IJPC');

// Création
const enCréation = ref(false);
const créerNuée = async () => {
  enCréation.value = true;

  const idNuée = await constl?.nuées?.créerNuée({
    autorisation: autorisation.value,
  });
  if (!idNuée) throw new Error('Nuée non créée.');

  await constl?.nuées?.ajouterNomsNuée({
    id: idNuée,
    noms: Object.fromEntries(Object.entries(noms.value)),
  });
  await constl?.nuées?.ajouterDescriptionsNuée({
    id: idNuée,
    descriptions: Object.fromEntries(Object.entries(descriptions.value)),
  });

  fermer();
};

// Fermer
const fermer = () => {
  noms.value = {};
  descriptions.value = {};
  autorisation.value = 'IJPC';
  étape.value = 0;
  dialogue.value = false;
  enCréation.value = false;
};
</script>
