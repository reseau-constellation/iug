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
        <v-btn
          variant="flat"
          @click="fermer"
        >
          {{ t('communs.fermer') }} <v-icon end>mdi-close</v-icon>
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
import {inject, ref} from 'vue';
import {useDisplay} from 'vuetify/lib/framework.mjs';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import type {client} from '@constl/ipa';
import {obtIcôneContact} from './utils';
import {computed} from 'vue';

const props = defineProps<{dejaPresents: string[]}>();

const {mdAndUp} = useDisplay();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

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

  await constl?.profil?.sauvegarderContact({
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
