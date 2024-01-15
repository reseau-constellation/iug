<template>
  <v-row>
    <v-col cols="12">
      <p class="text-h4">
        {{ t('accueil.page.graphiques.titre') }}
      </p>
    </v-col>
    <v-col cols="12">
      <v-card
        class="text-start"
        variant="outlined"
      >
        <v-card-text>
          <graphique-historique-ligne
            titre="Mes bases de données"
            :vals="obtHistorique('mesBds')"
            couleur="#6e40aa"
          />
          <graphique-historique-ligne
            titre="Mes projets"
            couleur="#bf3caf"
          />
          <graphique-historique-ligne
            titre="Mes nuées"
            :vals="obtHistorique('mesNuées')"
            couleur="#fe4b83"
          />
          <graphique-historique-ligne
            titre="Réplications des mes données"
            couleur="#ff7847"
          />
          <graphique-historique-ligne
            titre="Mes connaissances"
            couleur="#e2b72f"
          />
          <graphique-historique-ligne
            titre="Mon réseau"
            couleur="#aff05b"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script lang="ts" setup>
import type {réseau} from '@constl/ipa';
import {computed, ref, watchEffect} from 'vue';
import {storeToRefs} from 'pinia';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import {utiliserHistorique} from '/@/état/historique';
import {constellation, enregistrerÉcoute, écouter} from '../utils';

import GraphiqueHistoriqueLigne from './GraphiqueHistoriqueLigne.vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const historique = utiliserHistorique({});

const constl = constellation();

const {obtHistorique} = storeToRefs(historique);

const bds = écouter(constl.bds.suivreBds);
const nBds = computed(() => bds.value?.length);
watchEffect(() => {
  historique.observer({clef: 'mesBds', val: nBds.value});
});

const projets = écouter(constl.projets.suivreProjets);
const nProjets = computed(() => projets.value?.length);
watchEffect(() => {
  historique.observer({clef: 'mesProjets', val: nProjets.value});
});

const nuées = écouter(constl.nuées.suivreNuées);
const nNuées = computed(() => nuées.value?.length);
watchEffect(() => {
  historique.observer({clef: 'mesNuées', val: nNuées.value});
});

const membresFiables = écouter(constl.réseau.suivreFiables);
const nMembresFiables = computed(() => membresFiables.value?.length);
watchEffect(() => {
  historique.observer({clef: 'mesConnaissances', val: nMembresFiables.value});
});

const membresRéseau = ref<réseau.infoMembreRéseau[]>();
const nMembresRéseau = computed(() => membresRéseau.value?.length);
enregistrerÉcoute(
  constl.réseau.suivreComptesRéseau({f: x => (membresRéseau.value = x), profondeur: 1}),
);
watchEffect(() => {
  historique.observer({clef: 'monRéseau', val: nMembresRéseau.value});
});
</script>
