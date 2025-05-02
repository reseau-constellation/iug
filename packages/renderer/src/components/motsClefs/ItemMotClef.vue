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
import {suivre} from '@constl/vue';
import {icôneObjet, utiliserConstellation} from '/@/components/utils';

import LienObjet from '/@/components/communs/LienObjet.vue';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import { computed } from 'vue';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Nom du mot-clef
const noms = suivre(constl.motsClefs.suivreNomsMotClef, {idMotClef: computed(() => props.id)});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Descriptions
const descriptions = suivre(constl.motsClefs.suivreDescriptionsMotClef, {
  idMotClef: computed(() => props.id),
});
const descriptionTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);
</script>
