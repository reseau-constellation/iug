<template>
  <v-card class="text-start">
    <v-card-text>
      <v-radio-group
        v-model="typeConnexions"
        inline
      >
        <v-radio
          :label="t('pages.compte.connexions.Constellation')"
          value="Constellation"
        />
        <v-radio value="SFIP">
          <template #label>
            <div>
              <v-tooltip
                :text="t('pages.compte.connexions.indiceSFIP')"
                location="bottom"
              >
                <template #activator="{props: propsActivateur}">
                  <p v-bind="propsActivateur">{{ t('pages.compte.connexions.SFIP') }}</p>
                </template>
              </v-tooltip>
            </div>
          </template>
        </v-radio>
      </v-radio-group>
      <division-carte
        :titre="t(titreDivision)"
        :en-attente="!connexionsSFIP"
      />
      <div v-if="typeConnexions === 'Constellation'">
        <v-list
          v-if="connexionsConstellation"
          max-height="500"
          style="overflow-y: scroll"
        >
          <carte-membre
            v-for="membre in connexionsMembres"
            :id="membre.idCompte"
            :key="membre.idCompte"
          >
            <template #activator="{props}">
              <item-connexion-constellation
                v-bind="props"
                :compte="membre.idCompte"
                :dispositifs="membre.dispositifs"
              />
            </template>
          </carte-membre>
        </v-list>
      </div>
      <div v-else>
        <v-skeleton-loader
          v-if="!connexionsSFIP"
          type="list-item-avatar-two-line@3"
        />
        <v-list
          v-else-if="connexionsSFIP.length"
          max-height="500"
          style="overflow-y: scroll"
        >
          <item-connexion-sfip
            v-for="c in connexionsSFIP"
            :key="c.pair"
            :pair="c.pair"
            :adresses="c.adresses"
          />
        </v-list>
        <p
          v-else
          class="my-6 text-center text-disabled text-h6"
        >
          {{ t('pages.compte.connexions.aucuneSFIP') }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import type {réseau} from '@constl/ipa';

import {computed, ref} from 'vue';
import {constellation, suivre} from '/@/components/utils';
import DivisionCarte from '../communs/DivisionCarte.vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import ItemConnexionConstellation from './ItemConnexionConstellation.vue';
import ItemConnexionSfip from './ItemConnexionSFIP.vue';
import CarteMembre from '../membres/CarteMembre.vue';

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Navigation
const typeConnexions = ref<'SFIP' | 'Constellation'>('Constellation');
const titreDivision = computed(() => {
  switch (typeConnexions.value) {
    case 'SFIP':
      return 'pages.compte.connexions.titreSFIP';
    case 'Constellation':
      return 'pages.compte.connexions.titreConstellation';
    default:
      return '';
  }
});

// Connexions SFIP
const connexionsSFIP = suivre(constl.réseau.suivreConnexionsPostesSFIP);

// Connexions Constellation
const connexionsConstellation = suivre(constl.réseau.suivreConnexionsDispositifs);
const connexionsMembres = computed<{idCompte: string; dispositifs: réseau.statutDispositif[]}[]>(
  () => {
    const membres = [
      ...new Set(connexionsConstellation.value?.map(c => c.infoDispositif.idCompte) || []),
    ];
    return membres.map(m => ({
      idCompte: m,
      dispositifs:
        connexionsConstellation.value?.filter(c => c.infoDispositif.idCompte === m) || [],
    }));
  },
);
</script>
