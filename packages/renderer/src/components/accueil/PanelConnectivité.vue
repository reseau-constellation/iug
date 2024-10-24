<template>
  <v-row>
    <v-col cols="12">
      <p class="text-h4">
        {{ t('accueil.page.connectivité.titre') }}
      </p>
    </v-col>
    <v-col :cols="mdAndUp ? 4 : smAndUp ? 6 : 12">
      <v-card
        class="text-start"
        style="height: 100%"
      >
        <v-card-item>
          <v-card-title>
            <v-avatar><v-icon>mdi-server</v-icon></v-avatar>
            {{ t('accueil.page.connectivité.serveurLocal.titre') }}
          </v-card-title>
        </v-card-item>
        <v-card-text>
          <v-list>
            <v-list-item v-if="isElectron">
              <v-switch
                density="compact"
                :label="'Serveur actif'"
              />
            </v-list-item>
            <v-list-item prepend-icon="mdi-lan">
              <template #title>
                'Connections'
              </template>
            </v-list-item>
            <v-list-item prepend-icon="mdi-lan">
              <template #title>
                'Requêtes': {{ nRequêtesFormatte || 0 }}
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script lang="ts" setup>
import {computed} from 'vue';
import {useDisplay} from 'vuetify';

import {எண்களைப்_பயன்படுத்து, கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import { isElectron } from 'wherearewe';
import { utiliserServeurLocalConstellation } from '../utils';
import { suivre } from '@constl/vue';

const serveurLocal = utiliserServeurLocalConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {எண்ணை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();

const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const {mdAndUp, smAndUp} = useDisplay();

const requêtesServeurLocal = suivre(serveurLocal.suivreRequêtesAuthServeur.bind(serveurLocal));
const rRequêtes = computed(()=>requêtesServeurLocal.value?.length);
const nRequêtesFormatte = எண்ணை_வடிவூட்டு(rRequêtes);

</script>
