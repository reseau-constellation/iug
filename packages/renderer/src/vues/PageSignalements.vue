<template>
  <v-container class="text-center">
    <TitrePage
      :titre="t('pages.signalements.titre')"
      :image="imgProblème"
      :sous-titre="t('pages.signalements.sousTitre')"
    />
    <v-btn
      class="mx-2 my-2"
      variant="outlined"
      color="primary"
      @click="ouvrirLien(URL_SIGNALEMENTS)"
    >
      {{ t('pages.signalements.bouton') }}
      <v-icon end> mdi-open-in-new </v-icon>
    </v-btn>
    <v-btn
      class="mx-2 my-2"
      variant="outlined"
      @click="ouvrirLien(`mailto:${COURRIEL_SIGNALEMENTS}`)"
    >
      {{ t('pages.signalements.boutonCourriel') }}
      <v-icon end> mdi-email </v-icon>
    </v-btn>
  </v-container>
</template>
<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import TitrePage from '../components/communs/TitrePage.vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {COURRIEL_SIGNALEMENTS, URL_SIGNALEMENTS} from '/@/consts';
import {ouvrirLien} from '/@/utils';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const {obtImageDéco} = utiliserImagesDéco();

const imgProblème = obtImageDéco('problème');
</script>
