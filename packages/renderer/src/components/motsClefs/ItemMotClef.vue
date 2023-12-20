<template>
  <v-list-item
    class="text-start"
    :prepend-icon="icôneObjet('motClef')"
    density="compact"
  >
    <template #title>
      {{ nomTraduit || t('motsClefs.sansNom') }}
    </template>
    <template #subtitle>
      {{ descriptionTraduite || t('communs.baseCarteObjet.sansDescription') }}
    </template>
    <template #append>
      <lien-objet :id="id"></lien-objet>
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import type {ClientConstellation} from '@constl/ipa';

import {enregistrerÉcoute, icôneObjet} from '/@/components/utils';

import {ref, inject} from 'vue';

import LienObjet from '/@/components/communs/LienObjet.vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Nom du mot-clef
const noms = ref<{[lng: string]: string}>({});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

enregistrerÉcoute(
  constl?.motsClefs.suivreNomsMotClef({
    idMotClef: props.id,
    f: x => (noms.value = x),
  }),
);

// Descriptions
const descriptions = ref<{[lng: string]: string}>({});
const descriptionTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);

enregistrerÉcoute(
  constl?.motsClefs.suivreDescriptionsMotClef({
    idMotClef: props.id,
    f: x => (descriptions.value = x),
  }),
);
</script>
