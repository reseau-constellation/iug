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
      <v-card-title class="d-flex align-center text-h5">
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
        <v-divider class="my-4" />
        <p class="text-h6">{{ t('licences.contenu') }}</p>
        <v-dialog
          v-model="dialogueLicenceContenu"
          :disabled="mêmePourContenu"
        >
          <template #activator="{props: propsActivateur}">
            <jeton-licence
              v-bind="propsActivateur"
              class="mt-2 mx-2"
              :licence="mêmePourContenu ? licenceChoisie : licenceContenuChoisie"
              @click.stop
            />
          </template>
          <v-card
            class="mx-auto"
            scrollable
            max-width="500"
          >
            <v-card-title class="d-flex align-center text-h5">
              {{ t('licences.carte.titre') }}
              <v-spacer />
              <v-btn
                icon="mdi-close"
                variant="flat"
                size="small"
                @click="dialogueLicenceContenu = false"
              />
            </v-card-title>
            <v-divider />
            <v-card-text>
              <choix-licence
                :licence="licenceContenuChoisie"
                :permission-modifier="permissionModifier"
                @changer-licence="l => (licenceContenuChoisie = l)"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                variant="outlined"
                @click="dialogueLicenceContenu = false"
              >
                {{ t('communs.fermer') }}
                <v-icon end>mdi-close</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-checkbox
          v-if="permissionModifier"
          v-model="mêmePourContenu"
          hide-details
          color="primary"
          :label="t('licences.pareilPourContenu')"
        />
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <btn-annuler @click="fermer" />
        <btn-sauvegarder
          v-if="permissionModifier"
          :actif="licencesChangées"
          @click="() => sauvegarderLicence()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, ref, watchEffect} from 'vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import ChoixLicence from './ChoixLicence.vue';
import JetonLicence from './JetonLicence.vue';

import BtnAnnuler from '/@/components/communs/BtnAnnuler.vue';
import BtnSauvegarder from '/@/components/communs/BtnSauvegarder.vue';

const props = defineProps({
  licence: {type: String, required: false, default: undefined},
  licenceContenu: {type: String, required: false, default: undefined},
  permissionModifier: {default: false, type: Boolean},
});
const émettre = defineEmits<{
  (é: 'changerLicence', args: {licence: string; licenceContenu?: string}): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Dialogue
const dialogue = ref(false);
const dialogueLicenceContenu = ref(false);

// Changement licence
const licenceChoisie = ref(props.licence);
watchEffect(() => {
  licenceChoisie.value = props.licence;
});
const licenceChangée = computed(() => licenceChoisie.value !== props.licence);

// Contenu
const mêmePourContenu = ref(false);
const licenceContenuChoisie = ref(props.licenceContenu);
const licenceContenuChangée = computed(() => licenceContenuChoisie.value !== props.licenceContenu);
watchEffect(() => {
  if (mêmePourContenu.value) {
    licenceContenuChoisie.value = licenceChoisie.value;
  }
});

// Sauvegarder
const licencesChangées = computed(() => {
  return licenceChangée.value || licenceContenuChangée.value;
});
const sauvegarderLicence = () => {
  if (licenceChoisie.value)
    émettre('changerLicence', {
      licence: licenceChoisie.value,
      licenceContenu: licenceContenuChoisie.value,
    });
  dialogue.value = false;
};
const fermer = () => {
  dialogue.value = false;
  licenceChoisie.value = props.licence;
};
</script>
