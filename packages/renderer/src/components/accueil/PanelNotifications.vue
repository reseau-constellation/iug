<template>
  <v-card
    class="text-start"
    variant="flat"
    :class="['text-start', name === 'light' ? 'carte-découverte' : 'carte-découverte-nuit']"
    height="175"
  >
    <v-card-item>
      <v-card-title>
        {{ t('accueil.page.notifications.titre') }}
        <v-avatar
          v-if="notifications.length"
          class="mx-2"
          color="error"
          size="20"
        >
          {{ nNotificationsFormattée }}
        </v-avatar>
      </v-card-title>
    </v-card-item>
    <v-card-text>
      <v-list
        style="overflow-y: auto; background: rgb(255,255,255,0.3)"
        height="100"
      >
        <v-list-item v-if="!notifications.length">
          <v-list-item-title>{{ t('accueil.page.notifications.aucune') }}</v-list-item-title>
        </v-list-item>
        <v-list-item
          v-for="notif in notifications"
          :key="notif.id"
          append-icon="mdi-close"
        >
          <v-list-item-title>{{ notif.info.type }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import type {Info, InfoAvecId} from '/@/état/infos';

import {computed, ref} from 'vue';
import { useTheme } from 'vuetify';

import {கிளிமூக்கை_பயன்படுத்து, எண்களைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {எண்ணை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const { name } = useTheme();

const notifications = ref<InfoAvecId<Info>[]>([
  {
    info: {
      type: 'installer',
    },
    id: 'abc',
  },
  {
    info: {
      type: 'mettreÀJour',
      détails: {
        dernièreVersionDisponible: '1.0.0',
        versionActuelle: '0.0.1',
      },
    },
    id: 'def',
  },
  {
    info: {
      type: 'mettreÀJour',
      détails: {
        dernièreVersionDisponible: '1.0.0',
        versionActuelle: '0.0.1',
      },
    },
    id: 'def',
  },
]);

const nNotificationsFormattée = எண்ணை_வடிவூட்டு(computed(() => notifications.value.length));
</script>
<style scoped>
.carte-découverte {
  background: linear-gradient(142deg, rgb(137, 255, 176, 0.408) 0%, rgb(213, 233, 255) 65%, rgb(242, 242, 244) 100%);
}
.carte-découverte-nuit {
  background: linear-gradient(142deg, rgb(69, 69, 71) 0%, rgb(1, 100, 171) 35%, rgb(12, 162, 124) 100%);
}
</style>
