<template>
  <v-dialog
    v-model="dialogue"
    :max-width="mdAndUp ? 500 : 300"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card>
      <v-card-item>
        <v-card-title class="d-flex align-center">
          {{ t('épingler.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="fermer"
          >
          </v-btn>
        </v-card-title>
      </v-card-item>
      <v-divider />
      <v-card-text style="overflow-y: scroll">
        <v-icon start>mdi-pin-outline</v-icon>
        <span class="font-weight-bold"> {{ t('épingler.dispositifsÉpingle') }}</span>
        <selection-dispositifs
          v-model:selection="sélectionBase"
          v-model:specifiques="spécifiquesBase"
          class="ms-4"
        />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer></v-spacer>
        <btn-annuler @click="fermer" />
        <btn-sauvegarder
          :actif="baseValide && baseModifiée"
          :en-attente="enProgrès"
          @click="() => épingler()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {type favoris} from '@constl/ipa';

import {suivre} from '@constl/vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import SelectionDispositifs from './SélectionDispositifs.vue';
import {optionsDispositifs} from './utils';
import {utiliserConstellation} from '/@/components/utils';

import BtnAnnuler from '/@/components/communs/BtnAnnuler.vue';
import BtnSauvegarder from '/@/components/communs/BtnSauvegarder.vue';

const props = defineProps<{idMotClef: string}>();

const constl = utiliserConstellation();

const {mdAndUp} = useDisplay();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

// Navigation
const dialogue = ref(false);

// Épingle actuelle
const épingle = suivre(constl.motsClefs.suivreÉpingleMotClef, {
  idMotClef: computed(() => props.idMotClef),
});

// Options
const {
  sélection: sélectionBase,
  dispositifs: dispositifsBase,
  spécifiques: spécifiquesBase,
  valide: baseValide,
  modifié: baseModifiée,
} = optionsDispositifs(
  computed(() => épingle.value?.base),
  'TOUS',
);

// Sauvegarder
const enProgrès = ref(false);
const épingler = async () => {
  enProgrès.value = true;

  if (dispositifsBase.value && dispositifsBase.value !== 'AUCUN') {
    const épingle: favoris.ÉpingleMotClef = {
      type: 'motClef',
      base: dispositifsBase.value,
    };
    await constl.motsClefs.épinglerMotClef({
      idMotClef: props.idMotClef,
      options: épingle,
    });
  } else {
    await désépingler();
  }
  fermer();
};

const désépingler = async () => {
  await constl.favoris.désépinglerFavori({idObjet: props.idMotClef});
};

// Fermer
const fermer = () => {
  dialogue.value = false;
  enProgrès.value = false;
};
</script>
