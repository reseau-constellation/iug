<template>
  <base-item-info
    :titre="t('accueil.page.notifications.mettreÀJour.titre', {dispo: nouvelleVersionFormattée})"
    :sous-titre="
      t('accueil.page.notifications.mettreÀJour.sousTitre', {actuelle: versionAppliFormattée})
    "
    :texte-action="t('accueil.page.notifications.mettreÀJour.texteAction')"
    :info="info"
  >
    <template #contenu>
      <v-btn
        color="primary"
        variant="tonal"
        append-icon="mdi-download"
        @click="() => ouvrirLien(info.info.détails.urlTéléchargement)"
      >
        {{ t('accueil.page.notifications.mettreÀJour.installer') }}
      </v-btn>
    </template>
  </base-item-info>
</template>
<script setup lang="ts">
import type {InfoAvecId, InfoMettreÀJour} from '/@/état/infos';

import {computed} from 'vue';

import {எண்களைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import BaseItemInfo from './BaseItemInfo.vue';
import {ouvrirLien} from '/@/utils';

const props = defineProps<{
  info: InfoAvecId<InfoMettreÀJour>;
}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {பதிப்பை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();

const nouvelleVersionFormattée = computed(() => {
  return பதிப்பை_வடிவூட்டு(props.info.info.détails.dernièreVersionDisponible);
});
const versionAppliFormattée = பதிப்பை_வடிவூட்டு(props.info.info.détails.versionActuelle);
</script>
