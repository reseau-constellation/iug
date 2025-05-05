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
            <v-avatar><v-icon>mdi-wifi-arrow-up-down</v-icon></v-avatar>
            {{ t('accueil.page.connectivité.réseau.titre') }}
          </v-card-title>
        </v-card-item>
        <v-card-text>
          <v-list>
            <v-list-item :prepend-icon="enLigne ? 'mdi-wifi-check' : 'mdi-wifi-off'">
              {{
                enLigne
                  ? t('accueil.page.connectivité.réseau.enLigne')
                  : t('accueil.page.connectivité.réseau.horsLigne')
              }}
            </v-list-item>
            <v-list-item
              :prepend-icon="nConnexionsRéseau ? 'mdi-lan-connect' : 'mdi-lan-disconnect'"
            >
              {{ t('accueil.page.connectivité.réseau.connexionsRéseau', nConnexionsRéseau) }}
            </v-list-item>
            <v-list-item
              :prepend-icon="nConnexionsDispositifs ? 'mdi-lan-connect' : 'mdi-lan-disconnect'"
            >
              {{
                t('accueil.page.connectivité.réseau.connexionsDispositifs', nConnexionsDispositifs)
              }}
            </v-list-item>
          </v-list>
          <div class="text-center">
            <dialogue-connexion>
              <template #activateur="{props: propsActivateur}">
                <v-btn
                  v-bind="propsActivateur"
                  class="mx-auto"
                  variant="outlined"
                  prepend-icon="mdi-wifi-plus"
                >
                  {{ t('accueil.page.connectivité.réseau.connecter') }}
                </v-btn>
              </template>
            </dialogue-connexion>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      v-if="isElectron"
      :cols="mdAndUp ? 4 : smAndUp ? 6 : 12"
    >
      <sous-panel-serveur-local />
    </v-col>
  </v-row>
</template>
<script lang="ts" setup>
import {computed} from 'vue';
import {useDisplay} from 'vuetify';

import {suivre} from '@constl/vue';
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {useNow, useOnline} from '@vueuse/core';
import {isElectron} from 'wherearewe';
import {utiliserConstellation} from '../utils';

import DialogueConnexion from './DialogueConnexion.vue';
import SousPanelServeurLocal from './nœudLocal/SousPanelNœudLocal.vue';

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const {mdAndUp, smAndUp} = useDisplay();

// Connectivité
const enLigne = useOnline();
const maintenant = useNow();
const connexionsRéseau = suivre(constl.réseau.suivreConnexionsPostesSFIP);
const nConnexionsRéseau = computed(() => connexionsRéseau.value?.length);
const connexionsDispositifs = suivre(constl.réseau.suivreConnexionsDispositifs);
const nConnexionsDispositifs = computed(() =>
  connexionsDispositifs.value
    ? connexionsDispositifs.value.filter(
        c => !c.vuÀ || maintenant.value.getTime() - c.vuÀ <= 1000 * 10,
      ).length - 1
    : undefined,
);
</script>
