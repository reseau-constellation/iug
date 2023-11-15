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
      :width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex">
          {{ titreCarte }}
        </v-card-title>
        <v-card-subtitle> {{ sousTitreCarte }} </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <v-window
          v-model="étape"
          style="overflow-y: scroll"
        >
          <v-window-item :value="0">
            <liste-noms
              :texte-aucun-nom="t('communs.texteAucunNom')"
              :indice-langue="t('communs.indiceLangue')"
              :indice-nom="t('communs.indiceNom')"
              :noms-initiaux="noms"
              :autorisation-modification="true"
              @ajuster-noms="ajusterNoms"
            />
          </v-window-item>
          <v-window-item :value="1"> À faire </v-window-item>
          <v-window-item :value="2">
            <div class="text-center">
              <h3 class="text-h6 font-weight-light mb-2">
                {{ t('tableaux.nouveau.texteCréer') }}
              </h3>
              <p>
                <v-btn
                  class="mt-3"
                  variant="outlined"
                  @click="confirmer"
                >
                  {{ t('tableaux.nouveau.texteBtnCréation') }}
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
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import type {tableaux as tblx, valid} from '@constl/ipa';

import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';

import ListeNoms from '/@/components/communs/listeNoms/ListeNoms.vue';

const props = defineProps<{importationPermise: boolean}>();
const émettre = defineEmits<{
  (
    é: 'sauvegarder',
    args: {
      noms: {[langue: string]: string};
      cols: {info: tblx.InfoCol; règles: valid.règleVariableAvecId[]}[];
    },
  ): void;
}>();

const {mdAndUp} = useDisplay();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = ['noms', 'importerDonnées', 'confirmation'] as const;

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return t('tableaux.nouveau.titreNoms');
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return t('tableaux.nouveau.sousTitreNoms');
    default:
      return '';
  }
});

const retour = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'confirmation':
      étape.value = listeÉtapes.indexOf(props.importationPermise ? 'importerDonnées' : 'noms');
      break;
    default:
      étape.value--;
      break;
  }
};

const suivant = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      étape.value = listeÉtapes.indexOf(
        props.importationPermise ? 'importerDonnées' : 'confirmation',
      );
      break;
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
    default:
      return {actif: true, visible: true};
  }
});

// Noms tableau
const noms = ref<{[langue: string]: string}>({});
const ajusterNoms = (nms: {[lng: string]: string}) => {
  noms.value = nms;
};

// Colonnes
const cols = ref<{info: tblx.InfoCol; règles: valid.règleVariableAvecId[]}[]>();

// Confirmation
const confirmer = () => {
  émettre('sauvegarder', {
    noms: noms.value,
    cols: cols.value || [],
  });
  fermer();
};

const fermer = () => {
  noms.value = {};
  cols.value = [];

  étape.value = 0;
  dialogue.value = false;
};
</script>
