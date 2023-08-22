<template>
  <v-list-item>
    <template #prepend>
      <image-profil :id="idDUnAuteur"> </image-profil>
    </template>
    <v-list-item-title>
      {{ t('auteurs.item.titre', {n: nAuteursAcceptésFormatté}, nAuteursAcceptés) }}
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import {computed} from 'vue';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserNumération} from '/@/plugins/localisation/localisation';

import ImageProfil from './ImageProfil.vue';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {formatterChiffre} = utiliserNumération();

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
const nAuteursAcceptésFormatté = formatterChiffre(nAuteursAcceptés);
</script>
