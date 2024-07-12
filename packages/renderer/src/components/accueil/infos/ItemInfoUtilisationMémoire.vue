<template>
  <base-item-info
    :titre="t('accueil.page.notifications.utilisationMémoire.titre')"
    :sous-titre="t('accueil.page.notifications.utilisationMémoire.sousTitre')"
    :texte-action="t('accueil.page.notifications.utilisationMémoire.texteAction', {pourcentage})"
    :info="info"
  >
    <template #contenu>
      <v-btn
        color="primary"
        variant="outlined"
        append-icon="mdi-content-save-outline"
        @click="() => $router.push('/favoris')"
      >
        {{ t('accueil.page.notifications.utilisationMémoire.btnAction') }}
      </v-btn>
    </template>
  </base-item-info>
</template>
<script setup lang="ts">
import {type InfoAvecId, type InfoUtilisationMémoire} from '/@/état/infos';

import {computed} from 'vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import BaseItemInfo from './BaseItemInfo.vue';

const props = defineProps<{
  info: InfoAvecId<InfoUtilisationMémoire>;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const pourcentage = computed(() => {
  const {quota, utilisation} = props.info.info.détails;
  return (utilisation / quota) * 100;
});
</script>
