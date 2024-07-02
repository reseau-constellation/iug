<template>
  <v-dialog
    v-model="dialogue"
    persistent
  >
    <v-card class="mx-auto">
      <v-card-text class="text-center">
        <p class="text-h4">Constellation est déjà ouverte</p>
        <p class="text-h6">Assurez-vous de fermer toutes les instances de Constellation (ligne de commande, Python ou autre) ouvertes sur votre ordinateur, puis relancez Constellation.</p>
        <v-btn @click="()=>redémarrer()">Relancer Constellation</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { computed } from 'vue';
// import { utiliserConstellation} from '/@/components/utils';
import {
  ERREUR_INIT_IPA,
  ERREUR_INIT_IPA_DÉJÀ_LANCÉ,
  type ErreurMandataire,
} from '@constl/mandataire';
import {redémarrer} from '#preload';
import { ref } from 'vue';

// const constl = utiliserConstellation();

const erreursConstellation = ref<ErreurMandataire|undefined>(undefined);  // suivre(constl.suivreErreurs);
const dialogue = computed(()=>erreursConstellation.value?.code === ERREUR_INIT_IPA || erreursConstellation.value?.code === ERREUR_INIT_IPA_DÉJÀ_LANCÉ);

</script>