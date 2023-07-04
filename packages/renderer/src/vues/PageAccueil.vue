<template>
  <v-container class="text-center">
    <TitrePage :titre="t('communs.constellation')" />
    <ServeurWS v-if="isElectron" />
  </v-container>
</template>

<script setup lang="ts">
import TitrePage from '/@/components/communs/TitrePage.vue';
import ServeurWS from '/@/components/accueil/ServeurWS.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import {isElectron} from 'wherearewe';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
</script>
