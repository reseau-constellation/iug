<template>
  <v-container class="text-center">
    <TitrePage :titre="t('communs.constellation')" />
    <v-row class="mt-2">
      <v-col :cols="mdAndUp ? 4 : smAndUp ? 6 : 12">
        <PanelDécouvrir />
      </v-col>
      <v-col :cols="mdAndUp ? 4 : smAndUp ? 6 : 12">
        <PanelApprendre />
      </v-col>
      <v-col :cols="mdAndUp ? 4 : smAndUp ? 6 : 12">
        <PanelNotifications />
      </v-col>
    </v-row>

    <PanelConnectivite />

    <PanelRecents />

    <PanelGraphiques />
  </v-container>
</template>

<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import PanelApprendre from '/@/components/accueil/PanelApprendre.vue';
import PanelConnectivite from '/@/components/accueil/PanelConnectivité.vue';
import PanelDécouvrir from '/@/components/accueil/PanelDécouvrir.vue';
import PanelGraphiques from '/@/components/accueil/PanelGraphiques.vue';
import PanelNotifications from '/@/components/accueil/PanelNotifications.vue';
import PanelRecents from '/@/components/accueil/PanelRécents.vue';
import TitrePage from '/@/components/communs/TitrePage.vue';

import {useDisplay} from 'vuetify';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const {mdAndUp, smAndUp} = useDisplay();
</script>
