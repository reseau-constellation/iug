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
        <v-card-title>
          {{ t('membres.nouvelleInfoContact.titre') }}
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
        <v-select
          v-model="type"
          variant="outlined"
          :items="itemsType"
          :label="t('membres.nouvelleInfoContact.indiceType')"
        >
          <template #item="{item, props: propsItem}">
            <v-list-item v-bind="propsItem">
              <template #prepend>
                <v-icon :icon="obtIcôneContact({type: item.title})"></v-icon>
              </template>
              <template #title>
                {{ t(`membres.contact.${item.title}`) }}
              </template>
            </v-list-item>
          </template>
          <template #selection="{item}">
            <v-icon
              :icon="obtIcôneContact({type: item.title})"
              start
            ></v-icon>
            {{ t(`membres.contact.${item.title}`) }}
          </template>
        </v-select>
        <v-expand-transition>
          <v-text-field
            v-show="type === 'autre'"
            v-model="autreType"
            :label="t('membres.nouvelleInfoContact.indiceAutreType')"
            variant="outlined"
          ></v-text-field>
        </v-expand-transition>
        <v-text-field
          v-model="valeur"
          variant="outlined"
          :disabled="!type"
          :label="t('membres.nouvelleInfoContact.valeur')"
          :prepend-inner-icon="type ? obtIcôneContact({type}) : undefined"
        >
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <btn-annuler @click="fermer" />
        <btn-sauvegarder
          :actif="!!valeurEtTypeFinaux"
          :en-attente="sauvegardeEnCours"
          @click="() => sauvegarder()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ref} from 'vue';
import {useDisplay} from 'vuetify';

import {computed} from 'vue';
import {utiliserConstellation} from '../utils';
import {obtIcôneContact} from './utils';

import BtnAnnuler from '/@/components/communs/BtnAnnuler.vue';
import BtnSauvegarder from '/@/components/communs/BtnSauvegarder.vue';

const props = defineProps<{dejaPresents: string[]}>();

const {mdAndUp} = useDisplay();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

// Navigation
const dialogue = ref(false);

// Options
const valeur = ref<string>();
const type = ref<string>();
const autreType = ref<string>();
const sauvegardeEnCours = ref(false);

const itemsType = computed(() => {
  return [
    ...['courriel', 'siteInternet', 'téléphone', 'télégramme', 'whatsapp'].filter(
      x => !props.dejaPresents.includes(x),
    ),
    'autre',
  ];
});

// Contrôles
const valeurEtTypeFinaux = computed<{valeur: string; type: string} | undefined>(() => {
  if (!valeur.value || !type.value) return;
  const typeFinal = type.value === 'autre' ? autreType.value : type.value;
  if (!typeFinal) return;

  return {valeur: valeur.value, type: typeFinal};
});
const sauvegarder = async () => {
  sauvegardeEnCours.value = true;
  if (!valeurEtTypeFinaux.value) return;

  await constl.profil.sauvegarderContact({
    type: valeurEtTypeFinaux.value.type,
    contact: valeurEtTypeFinaux.value.valeur,
  });
  sauvegardeEnCours.value = false;
  fermer();
};

const fermer = () => {
  dialogue.value = false;
  valeur.value = undefined;
  autreType.value = undefined;
  type.value = undefined;
};
</script>
