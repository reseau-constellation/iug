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
              :texte-aucun-nom="t('motsClefs.nouveau.texteAucuneDescription')"
              :indice-langue="t('communs.indiceLangue')"
              :indice-nom="t('motsClefs.nouveau.texteIndiceDescription')"
              :noms-initiaux="descriptions"
              :autorisation-modification="true"
              @ajuster-noms="ajusterDescriptions"
            />
          </v-window-item>
          <v-window-item :key="2">
            <div class="text-center">
              <h3 class="text-h6 font-weight-light mb-2">
                {{ t('motsClefs.nouveau.texteCréer') }}
              </h3>
              <p>
                <v-btn
                  class="mt-3"
                  variant="outlined"
                  :loading="enCréation"
                  @click="() => créerMotClef()"
                >
                  {{ t('motsClefs.nouveau.texteBtnCréation') }}
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
import {computed, inject, ref} from 'vue';
import type {client} from '@constl/ipa';

import {useDisplay} from 'vuetify';
import ListeNoms from '../communs/listeNoms/ListeNoms.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = ['noms', 'descriptions', 'confirmation'] as const;

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return t('motsClefs.nouveau.titreNoms');
    case 'descriptions':
      return t('motsClefs.nouveau.titreDescriptions');
    case 'confirmation':
      return t('motsClefs.nouveau.titreConfirmation');
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return t('motsClefs.nouveau.sousTitreNoms');
    case 'descriptions':
      return t('motsClefs.nouveau.sousTitreDescriptions');
    case 'confirmation':
      return t('motsClefs.nouveau.sousTitreConfirmation');
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

// Création
const enCréation = ref(false);
const créerMotClef = async () => {
  enCréation.value = true;

  const idMotClef = await constl?.motsClefs?.créerMotClef();
  if (!idMotClef) throw new Error('Mot clef non créé.');

  await constl?.motsClefs?.sauvegarderNomsMotClef({
    idMotClef: idMotClef,
    noms: Object.fromEntries(Object.entries(noms.value)),
  });
  await constl?.motsClefs?.sauvegarderDescriptionsMotClef({
    idMotClef: idMotClef,
    descriptions: Object.fromEntries(Object.entries(descriptions.value)),
  });

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
