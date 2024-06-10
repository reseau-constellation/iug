<template>
  <v-alert
    class="mt-2"
    type="info"
    variant="outlined"
    density="compact"
  >
    <template #title>
      {{ t('accueil.page.notifications.connecterInstallé.étape1.apple.titre') }}
      <v-btn
        :icon="détails ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        size="xsmall"
        variant="flat"
        @click="() => (détails = !détails)"
      />
    </template>

    <template #text>
      <v-expand-transition>
        <div v-show="détails">
          <p>
            {{ t('accueil.page.notifications.connecterInstallé.étape1.apple.texte') }}
          </p>
          <v-btn
            class="my-2"
            variant="outlined"
            append-icon="mdi-open-in-new"
            @click="
              ouvrirLien(t('accueil.page.notifications.connecterInstallé.étape1.apple.lienExterne'))
            "
          >
            {{ t('accueil.page.notifications.connecterInstallé.étape1.apple.btn') }}
          </v-btn>
        </div>
      </v-expand-transition>
    </template>
  </v-alert>
</template>
<script setup lang="ts">
import {ref} from 'vue';

import {ouvrirLien} from '/@/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const détails = ref(false);
</script>
