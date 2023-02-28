<template>
  <v-list-item
    class="text-start"
    prepend-icon="mdi-key"
    density="compact"
  >
    <template #title>
      {{ nomTraduit || t('motsClefs.sansNom') }}
    </template>
    <template #subtitle>
      {{ descriptionTraduite || t('motsClefs.sansDescription') }}
    </template>
    <template #append>
      <lien-objet :id="id"></lien-objet>
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa';
import type {schémaFonctionOublier} from '@constl/ipa/dist/src/utils';
import {ref, inject, onMounted, onUnmounted} from 'vue';
import LienObjet from '../communs/LienObjet.vue';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {traduireNom} = utiliserLangues();

// Nom du mot-clef
const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

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

// Descriptions
const descriptions = ref<{[lng: string]: string}>({});
const descriptionTraduite = traduireNom(descriptions);

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
