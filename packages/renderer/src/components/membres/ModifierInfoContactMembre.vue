<template>
  <v-dialog
    v-model="dialogue"
    :max-width="mdAndUp ? 500 : 300"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card>
      <v-card-item>
        <v-card-title class="d-flex">
          {{ t('membres.modifierInfoContact.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            variant="flat"
            size="small"
            @click="fermer"
          />
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <p class="mb-4">
          <v-icon
            color="warning"
            icon="mdi-alert-circle-outline"
          ></v-icon>
          {{ t('membres.nouvelleInfoContact.avertissement') }}
        </p>
        <v-text-field
          v-model="valeur"
          variant="outlined"
          :label="t('membres.nouvelleInfoContact.valeur')"
          :prepend-inner-icon="type ? obtIcôneContact({type}) : undefined"
        >
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer />

        <v-btn
          variant="outlined"
          color="error"
          @click="effacer"
        >
          {{ t('communs.effacer') }} <v-icon end>mdi-delete</v-icon>
        </v-btn>
        <v-btn
          variant="outlined"
          color="primary"
          :disabled="!valeurEtTypeFinaux"
          :loading="sauvegardeEnCours"
          @click="sauvegarder"
        >
          {{ t('communs.sauvegarder') }} <v-icon end>mdi-check</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ref} from 'vue';
import {useDisplay} from 'vuetify';

import {computed, watchEffect} from 'vue';
import {utiliserConstellation} from '../utils';
import {obtIcôneContact} from './utils';

const props = defineProps<{type: string; valeurAvant: string}>();

const {mdAndUp} = useDisplay();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Navigation
const dialogue = ref(false);

// Options
const valeur = ref(props.valeurAvant);
const sauvegardeEnCours = ref(false);

watchEffect(() => {
  valeur.value = props.valeurAvant;
});

// Contrôles
const valeurEtTypeFinaux = computed<{valeur: string; type: string} | undefined>(() => {
  if (!valeur.value) return;
  return {valeur: valeur.value, type: props.type};
});
const sauvegarder = async () => {
  sauvegardeEnCours.value = true;
  if (!valeurEtTypeFinaux.value) return;

  await effacer();

  await constl.profil.sauvegarderContact({
    type: valeurEtTypeFinaux.value.type,
    contact: valeurEtTypeFinaux.value.valeur,
  });
  sauvegardeEnCours.value = false;
  fermer();
};

const effacer = async () => {
  await constl.profil.effacerContact({
    type: props.type,
    contact: props.valeurAvant,
  });
};

const fermer = () => {
  dialogue.value = false;
  valeur.value = props.valeurAvant;
};
</script>
