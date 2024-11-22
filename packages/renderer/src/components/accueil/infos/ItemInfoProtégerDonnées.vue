<template>
  <base-item-info
    :titre="t('accueil.page.notifications.protégerDonnées.titre')"
    :sous-titre="t('accueil.page.notifications.protégerDonnées.sousTitre')"
    :texte-action="t('accueil.page.notifications.protégerDonnées.texteAction')"
    :info="info"
  >
    <template #contenu>
      <p class="mb-4">
        <span class="mb-4 font-weight-bold">{{ t('accueil.initialiserCompte.plusDInfo') }}</span>
        <v-btn
          :icon="détailsPersister ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          size="xsmall"
          variant="flat"
          @click="() => (détailsPersister = !détailsPersister)"
        ></v-btn>
        <v-expand-transition>
          <div v-show="détailsPersister">
            <p class="mb-4"> {{ t('accueil.initialiserCompte.textePersister.1') }} </p>
            <p class="mb-4"> {{ t('accueil.initialiserCompte.textePersister.2') }} </p>
            <p class="mb-4"> {{ t('accueil.initialiserCompte.textePersister.3') }} </p>
          </div>
        </v-expand-transition>
      </p>
      <v-btn
        color="primary"
        variant="outlined"
        append-icon="mdi-content-save-outline"
        @click="() => persisterDonnées()"
      >
        {{ t('accueil.page.notifications.protégerDonnées.protéger') }}
      </v-btn>
    </template>
  </base-item-info>
</template>
<script setup lang="ts">
import {type InfoAvecId, type InfoProtégerDonnnées, utiliserÉtatInfos} from '/@/état/infos';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ref} from 'vue';
import BaseItemInfo from './BaseItemInfo.vue';

const props = defineProps<{
  info: InfoAvecId<InfoProtégerDonnnées>;
}>();

const étatInfos = utiliserÉtatInfos();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const persisterDonnées = async () => {
  const persistées = await navigator.storage.persist();
  if (persistées) {
    étatInfos.effacerInfo(props.info.id);
  }
};

const détailsPersister = ref(false);
</script>
