<template>
  <TitrePage
    :titre="$t('pages.compte.titre')"
    :image="imgDonnées"
  />
  <v-row>
    <v-chip>Mots-clefs</v-chip>
    <v-chip>Variables</v-chip>
    <v-chip>Bases de données</v-chip>
    <v-chip>Projets</v-chip>
    <v-chip>Nuées</v-chip>
  </v-row>
  <v-window>
    <v-window-item></v-window-item>
    <v-window-item></v-window-item>
    <v-window-item></v-window-item>
    <v-window-item></v-window-item>
    <v-window-item></v-window-item>
  </v-window>
</template>

<script setup lang="ts">
import TitrePage from '/@/components/TitrePage.vue';
import {utiliserImagesDéco} from '/@/composables/images';

const {obtImageDéco} = utiliserImagesDéco();

const imgDonnées = obtImageDéco('données');
</script>
