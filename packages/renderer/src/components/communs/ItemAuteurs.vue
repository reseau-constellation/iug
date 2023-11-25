<template>
  <v-list-item>
    <template #prepend>
      <image-profil :id="idDUnAuteur"> </image-profil>
    </template>
    <v-list-item-title>
      {{ t('auteurs.item.titre', nAuteursAcceptés) }}
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import {computed} from 'vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import ImageProfil from './ImageProfil.vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const props = defineProps<{auteurs: types.infoAuteur[] | undefined}>();

// Auteurs
const auteursAcceptés = computed(() => {
  return (props.auteurs || []).filter(a => a.accepté);
});
const idDUnAuteur = computed(() => {
  if (auteursAcceptés.value.length) {
    return auteursAcceptés.value[Math.floor(auteursAcceptés.value.length * Math.random())]
      ?.idCompte;
  }
  return undefined;
});

const nAuteursAcceptés = computed(() => {
  return auteursAcceptés.value.length;
});
</script>
