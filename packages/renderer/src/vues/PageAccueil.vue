<template>
  <v-container class="text-center">
    <TitrePage :titre="t('communs.constellation')" />
    <v-row class="mt-2">
      <v-col :cols="mdAndUp ? 4 : (smAndUp ? 6: 12)">
        <PanelDécouvrir />
      </v-col>
      <v-col :cols="mdAndUp ? 4 : (smAndUp ? 6: 12)">
        <PanelApprendre />
      </v-col>
      <v-col :cols="mdAndUp ? 4 : (smAndUp ? 6: 12)">
        <PanelNotifications />
      </v-col>
    </v-row>
    <PanelRecents />

    <PanelGraphiques />
  </v-container>
</template>

<script setup lang="ts">
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import TitrePage from '/@/components/communs/TitrePage.vue';
import PanelNotifications from '/@/components/accueil/PanelNotifications.vue';
import PanelApprendre from '/@/components/accueil/PanelApprendre.vue';
import PanelGraphiques from '/@/components/accueil/PanelGraphiques.vue';
import PanelDécouvrir from '/@/components/accueil/PanelDécouvrir.vue';
import PanelRecents from '/@/components/accueil/PanelRécents.vue';

import {useDisplay} from 'vuetify';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const {mdAndUp, smAndUp} = useDisplay();
</script>
