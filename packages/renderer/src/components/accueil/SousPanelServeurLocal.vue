<template>
  <v-card
    class="text-start"
    style="height: 100%"
  >
    <v-card-item>
      <v-card-title>
        <v-avatar><v-icon>mdi-transit-connection-horizontal</v-icon></v-avatar>
        {{ t('accueil.page.connectivité.serveurLocal.titre') }}
      </v-card-title>
    </v-card-item>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-switch
            class="mx-2"
            density="compact"
            hide-details
            disabled
            true-icon="mdi-check"
            false-icon="mdi-close"
            :label="
              étatServeur?.état === 'actif'
                ? t('accueil.page.connectivité.serveurLocal.activé')
                : t('accueil.page.connectivité.serveurLocal.désactivé')
            "
          />
        </v-list-item>
        <v-list-item prepend-icon="mdi-lan">
          {{ t('accueil.page.connectivité.serveurLocal.requêtes', nRequêtes || 0) }}
        </v-list-item>
        <div class="text-center">
          <controles-serveur-local>
            <template #activator="{props: propsActivateur}">
              <v-btn
                v-bind="propsActivateur"
                class="mx-auto"
                variant="outlined"
                prepend-icon="mdi-toggle-switch-outline"
              >
                {{ t('accueil.page.connectivité.serveurLocal.gérer') }}
              </v-btn>
            </template>
          </controles-serveur-local>
        </div>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import {utiliserServeurLocalConstellation} from '../utils';

import ControlesServeurLocal from './ContrôlesServeurLocal.vue';

const serveurLocal = utiliserServeurLocalConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();

const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Serveur local
const requêtesServeurLocal = suivre(serveurLocal.suivreRequêtesAuthServeur.bind(serveurLocal));
const nRequêtes = computed(() => requêtesServeurLocal.value?.length);

const étatServeur = suivre(serveurLocal.suivreÉtatServeur.bind(serveurLocal));
</script>
