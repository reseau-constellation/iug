<template>
  <base-item-info 
    :titre="'==Constellation {{ info.info.détails.dernièreVersionDisponible }} est disponible' + nouvelleVersionFormattée"
    :sous-titre="'==Vous êtes sur version {{ info.info.détails.versionActuelle }}' + versionAppliFormattée"
    :texte-action="'==Installer'"
    :info="info"
  >
    <template #contenu>
      <v-btn
        color="primary"
        variant="tonal"
        append-icon="mdi-download"
        @click="() => ouvrirLien(URL_TÉLÉCHARGEMENTS)"
      >
        Installer maintenant
      </v-btn>
    </template>
  </base-item-info>
</template>
<script setup lang="ts">
import type {InfoAvecId, InfoMettreÀJour} from '/@/état/infos';

import { computed } from 'vue';

import {ouvrirLien} from '/@/utils';
import {URL_TÉLÉCHARGEMENTS} from '/@/consts';
import BaseItemInfo from './BaseItemInfo.vue';
import { எண்களைப்_பயன்படுத்து } from '@lassi-js/kilimukku-vue';


const props = defineProps<{
  info: InfoAvecId<InfoMettreÀJour>;
}>();

const {பதிப்பை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();

const nouvelleVersionFormattée = computed(() => {
  return பதிப்பை_வடிவூட்டு(props.info.info.détails.dernièreVersionDisponible);
});
const versionAppliFormattée = பதிப்பை_வடிவூட்டு(props.info.info.détails.versionActuelle);

</script>
