<template>
  <v-dialog
    v-model="dialogue"
    persistent
  >
    <v-card class="mx-auto">
      <v-card-text class="text-center">
        <p class="text-h4">{{ t(titre) }}</p>
        <p class="text-h6">
          {{ t(explication) }}
        </p>
        <v-btn @click="() => redémarrer()">{{ 'erreurs.relancer' }}</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {computed} from 'vue';
import { utiliserConstellation} from '/@/components/utils';
import {redémarrer} from '#preload';
import {
  ERREUR_INIT_IPA,
  ERREUR_INIT_IPA_DÉJÀ_LANCÉ,
} from '@constl/mandataire';
import { suivre } from '@constl/vue';
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = utiliserConstellation();

const erreursConstellation = suivre(constl.suivreErreurs);
const dialogue = computed(
  () => erreurDéjàLancée.value || erreurInit.value,
);

const erreurDéjàLancée = computed (
  () => erreursConstellation.value?.code === ERREUR_INIT_IPA_DÉJÀ_LANCÉ,
);

const erreurInit = computed(
  () => erreursConstellation.value?.code === ERREUR_INIT_IPA,
);

const titre = computed(
  () => {
    if (erreurDéjàLancée.value) return 'erreurs.init.titre';
    else if (erreurInit.value) return 'erreurs.déjàLancé.titre';
    else return '';
  },
);

const explication = computed(
  () => {
    if (erreurDéjàLancée.value) return 'erreurs.init.explication';
    else if (erreurInit.value) return 'erreurs.déjàLancé.explication';
    else return '';
  },
);
</script>
