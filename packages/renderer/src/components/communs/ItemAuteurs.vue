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

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import ImageProfil from './ImageProfil.vue';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

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
