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
        :titre="titreDivision"
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
        <v-list
          v-if="connexionsSFIP"
          max-height="500"
          style="overflow-y: scroll"
        >
          <ItemConnexionSFIP
            v-for="c in connexionsSFIP"
            :key="c.adresse"
            :pair="c.pair"
            :adresse="c.adresse"
          />
        </v-list>
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import type {client, réseau} from '@constl/ipa';

import {computed, inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/components/utils';
import DivisionCarte from '../communs/DivisionCarte.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import ItemConnexionConstellation from './ItemConnexionConstellation.vue';
import ItemConnexionSFIP from './ItemConnexionSFIP.vue';
import CarteMembre from '../membres/CarteMembre.vue';

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Navigation
const typeConnexions = ref<'SFIP' | 'Constellation'>('Constellation');
const titreDivision = computed(() => {
  switch (typeConnexions.value) {
    case 'SFIP':
      return t('pages.compte.connexions.titreSFIP');
    case 'Constellation':
      return t('pages.compte.connexions.titreConstellation');
    default:
      return '';
  }
});

// Connexions SFIP
const connexionsSFIP = ref<
  {
    adresse: string;
    pair: string;
  }[]
>();
enregistrerÉcoute(
  constl?.réseau?.suivreConnexionsPostesSFIP({
    f: x => (connexionsSFIP.value = x),
  }),
);

// Connexions Constellation
const connexionsConstellation = ref<réseau.statutDispositif[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreConnexionsDispositifs({
    f: x => (connexionsConstellation.value = x),
  }),
);
const connexionsMembres = computed<{idCompte: string; dispositifs: réseau.statutDispositif[]}[]>(
  () => {
    const membres = [
      ...(new Set(connexionsConstellation.value?.map(c => c.infoDispositif.idCompte)) || []),
    ];
    return membres.map(m => ({
      idCompte: m,
      dispositifs:
        connexionsConstellation.value?.filter(c => c.infoDispositif.idCompte === m) || [],
    }));
  },
);
</script>
