<template>
  <v-card
    :class="['text-start', name === 'light' ? 'carte-découverte' : 'carte-découverte-nuit']"
    variant="flat"
    height="175"
  >
    <v-card-item>
      <v-card-title>
        {{ t('accueil.page.découvrir.titre') }}
      </v-card-title>
    </v-card-item>
    <v-card-text>
      <v-btn
        class="ma-2"
        prepend-icon="mdi-database"
        :append-icon="isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"
        @click="() => $router.push(encodeURI('./recherche'))"
      >
        {{ t('accueil.page.découvrir.données') }}
      </v-btn>
      <v-btn
        class="ma-2"
        prepend-icon="mdi-chat-outline"
        :append-icon="isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"
        @click="() => ouvrirLien(encodeURI(URL_COMMUNAUTÉ))"
      >
        {{ t('accueil.page.découvrir.communauté') }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {useRtl, useTheme} from 'vuetify';
import {ouvrirLien} from '/@/utils';
import {URL_COMMUNAUTÉ} from '/@/consts';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const {isRtl} = useRtl();
const {name} = useTheme();
</script>
<style scoped>
.carte-découverte {
  background: linear-gradient(
    142deg,
    rgb(242, 242, 244) 0%,
    rgb(217, 217, 247) 35%,
    rgb(183, 237, 248) 100%
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
