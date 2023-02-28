<template>
  <v-card>
    <v-card-item>
      <v-card-title>{{ nom || t('motsClefs.sansNom') }}</v-card-title>
    </v-card-item>
    <v-card-text>
      <p>{{ descriptions || t('motsClefs.sansDescription') }}</p>
    </v-card-text>
    <v-card-actions> </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import type {schémaFonctionOublier} from '@constl/ipa/dist/src/utils';
import {inject, onMounted, onUnmounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {utiliserLangues} from '/@/plugins/localisation/localisation';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {t} = useI18n();
const {traduireNom} = utiliserLangues();

// Autorisation
const monAutorisation = ref<'MODÉRATEUR' | 'MEMBRE' | undefined>();
let fOublierMonAutorisation: schémaFonctionOublier | undefined = undefined;
onMounted(async () => {
  fOublierMonAutorisation = await constl?.suivrePermission({
    idObjet: props.id,
    f: x => (monAutorisation.value = x),
  });
});
onUnmounted(async () => {
  if (fOublierMonAutorisation) await fOublierMonAutorisation();
});

// Nom mot-clef
const noms = ref<{[langue: string]: string}>({});
let fOublierNoms: schémaFonctionOublier | undefined = undefined;
onMounted(async () => {
  fOublierNoms = await constl?.motsClefs?.suivreNomsMotClef({
    id: props.id,
    f: x => (noms.value = x),
  });
});
onUnmounted(async () => {
  if (fOublierNoms) await fOublierNoms();
});
const nom = traduireNom(noms);

// Descriptions
const descriptions = ref<{[lng: string]: string}>({});

let fOublierDescriptions: schémaFonctionOublier | undefined = undefined;
onMounted(async () => {
  fOublierDescriptions = await constl?.motsClefs?.suivreDescriptionsMotClef({
    id: props.id,
    f: x => (descriptions.value = x),
  });
});
onUnmounted(async () => {
  if (fOublierDescriptions) await fOublierDescriptions();
});
</script>
