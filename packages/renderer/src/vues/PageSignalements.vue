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
import TitrePage from '../components/communs/TitrePage.vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {ouvrirLien} from '/@/utils';
import {URL_SIGNALEMENTS, COURRIEL_SIGNALEMENTS} from '/@/consts';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const {obtImageDéco} = utiliserImagesDéco();

const imgProblème = obtImageDéco('problème');
</script>
