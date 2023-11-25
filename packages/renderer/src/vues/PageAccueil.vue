<template>
  <v-container class="text-center">
    <TitrePage :titre="t('communs.constellation')" />
    <ServeurWS v-if="isElectron" />
  </v-container>
</template>

<script setup lang="ts">
import TitrePage from '/@/components/communs/TitrePage.vue';
import ServeurWS from '/@/components/accueil/ServeurWS.vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import {isElectron} from 'wherearewe';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
</script>
