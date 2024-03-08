<template>
  <v-dialog
    v-model="dialogue"
    scrollable
    max-width="500"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>

    <v-card>
      <v-card-title class="d-flex">
        {{ t('licences.carte.titre') }}
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="flat"
          size="small"
          @click="dialogue = false"
        />
      </v-card-title>
      <v-divider />

      <v-card-text>
        <choix-licence
          :licence="licenceChoisie"
          :permission-modifier="permissionModifier"
          @changer-licence="l => (licenceChoisie = l)"
        />
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          @click="fermer"
        >
          {{ t('communs.fermer') }}
          <v-icon end>mdi-close</v-icon>
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          :disabled="!licenceChangée"
          @click="sauvegarderLicence"
        >
          {{ t('communs.sauvegarder') }}
          <v-icon end>mdi-check</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, ref, watchEffect} from 'vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import ChoixLicence from './ChoixLicence.vue';

const props = defineProps({
  licence: {type: String, required: false, default: undefined},
  permissionModifier: {default: false, type: Boolean},
});
const émettre = defineEmits<{
  (é: 'changerLicence', licence: string): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Dialogue
const dialogue = ref(false);

// Changement licence
const licenceChoisie = ref(props.licence);
watchEffect(() => {
  licenceChoisie.value = props.licence;
});
const licenceChangée = computed(() => licenceChoisie.value !== props.licence);

// Sauvegarder
const sauvegarderLicence = () => {
  if (licenceChoisie.value) {
    émettre('changerLicence', licenceChoisie.value);
  }
  dialogue.value = false;
};
const fermer = () => {
  dialogue.value = false;
  licenceChoisie.value = props.licence;
};
</script>
