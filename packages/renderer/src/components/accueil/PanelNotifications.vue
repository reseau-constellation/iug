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
      <v-card
        v-if="!notifications.length"
        style="overflow-y: auto; background: rgb(255, 255, 255, 0.3)"
        class="d-flex align-center text-center"
        variant="flat"
      >
        <span class="pa-4 ma-auto text-h6 text-center text-disabled">
          {{ t('accueil.page.notifications.aucune') }}
        </span>
      </v-card>
      <v-list
        v-else
        style="overflow-y: auto; background: rgb(255, 255, 255, 0.3)"
        height="100"
      >
        <item-info
          v-for="notif in notifications"
          :key="notif.id"
          :info="notif"
        />
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import {utiliserÉtatInfos} from '/@/état/infos';

import {computed} from 'vue';
import {useTheme} from 'vuetify';

import ItemInfo from './infos/ItemInfo.vue';

import {கிளிமூக்கை_பயன்படுத்து, எண்களைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {எண்ணை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const {name} = useTheme();

const étatInfos = utiliserÉtatInfos();

const notifications = computed(() => étatInfos.infos);

const nNotificationsFormattée = எண்ணை_வடிவூட்டு(computed(() => notifications.value.length));
</script>
<style scoped>
.carte-découverte {
  background: linear-gradient(
    142deg,
    rgb(137, 255, 176, 0.408) 0%,
    rgb(213, 233, 255) 65%,
    rgb(242, 242, 244) 100%
  );
}
.carte-découverte-nuit {
  background: linear-gradient(
    142deg,
    rgb(69, 69, 71) 0%,
    rgb(1, 100, 171) 35%,
    rgb(12, 162, 124) 100%
  );
}
</style>
