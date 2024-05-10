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
        variant="elevated"
      >
        <v-card-text>
          <graphique-historique-ligne
            :titre="t('accueil.page.graphiques.bds')"
            :vals="obtHistorique('mesBds')"
            couleur="#6e40aa"
          />
          <graphique-historique-ligne
            :titre="t('accueil.page.graphiques.projets')"
            couleur="#bf3caf"
          />
          <graphique-historique-ligne
            :titre="t('accueil.page.graphiques.nuées')"
            :vals="obtHistorique('mesNuées')"
            couleur="#fe4b83"
          />
          <graphique-historique-ligne
            :titre="t('accueil.page.graphiques.réplications')"
            couleur="#ff7847"
          />
          <graphique-historique-ligne
            :titre="t('accueil.page.graphiques.connaissances')"
            couleur="#e2b72f"
          >
            <template #action>
              <div class="mx-auto mb-6 text-center text-disabled">
                <GestionConnaissances>
                  <template #activator="{props}">
                    <v-btn
                      v-bind="props"
                      variant="outlined"
                      prepend-icon="mdi-plus"
                    >
                      {{ t('accueil.page.graphiques.ajouterConnaissances') }}
                    </v-btn>
                  </template>
                </GestionConnaissances>
              </div>
            </template>
          </graphique-historique-ligne>
          <graphique-historique-ligne
            :titre="t('accueil.page.graphiques.réseau')"
            couleur="#aff05b"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script lang="ts" setup>
import {computed, onMounted, ref, watchEffect} from 'vue';
import {storeToRefs} from 'pinia';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import {utiliserHistorique} from '/@/état/historique';
import {constellation, rechercher, suivre} from '../utils';

import GraphiqueHistoriqueLigne from './GraphiqueHistoriqueLigne.vue';
import GestionConnaissances from '/@/components/réseau/GestionConnaissances.vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const historique = utiliserHistorique({});

const constl = constellation();

const {obtHistorique} = storeToRefs(historique);

const imageFond = ref<string>();
onMounted(async () => {
  imageFond.value = (await import('/@/assets/fonds/trianglify-lowres.png')).default;
});

const bds = suivre(constl.bds.suivreBds);
const nBds = computed(() => bds.value?.length);
watchEffect(() => {
  historique.observer({clef: 'mesBds', val: nBds.value});
});

const projets = suivre(constl.projets.suivreProjets);
const nProjets = computed(() => projets.value?.length);
watchEffect(() => {
  historique.observer({clef: 'mesProjets', val: nProjets.value});
});

const nuées = suivre(constl.nuées.suivreNuées);
const nNuées = computed(() => nuées.value?.length);
watchEffect(() => {
  historique.observer({clef: 'mesNuées', val: nNuées.value});
});

const membresFiables = suivre(constl.réseau.suivreFiables);
const nMembresFiables = computed(() => membresFiables.value?.length);
watchEffect(() => {
  historique.observer({clef: 'mesConnaissances', val: nMembresFiables.value});
});

const {résultats: membresRéseau} = rechercher(constl.réseau.suivreComptesRéseau);
const nMembresRéseau = computed(() => membresRéseau.value?.length);
watchEffect(() => {
  historique.observer({clef: 'monRéseau', val: nMembresRéseau.value});
});
</script>
