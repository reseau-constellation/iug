<template>
  <v-card class="text-start">
    <v-card-text>
      <v-radio-group
        v-model="typeConnexions"
        inline
      >
        <v-radio
          :label="t('compte.connexions.Constellation')"
          value="SFIP"
        />
        <v-radio
          :label="t('compte.connexions.SFIP')"
          value="Constellation"
        />
      </v-radio-group>
      <division-carte
        :titre="titreDivision"
        :en-attente="!connexionsSFIP"
      />
      <div v-if="typeConnexions === 'Constellation'">
        <v-list
          v-if="connexionsConstellation"
          max-height="500"
          style="overflow-y: scroll;"
        >
          <v-list-item
            v-for="c in connexionsConstellation"
            :key="c.infoDispositif.idOrbite"
          >
            <template #prepend>
              <v-icon>mdi-web</v-icon>
            </template>
            <v-list-item-title>{{ c.infoDispositif.idCompte }}</v-list-item-title>
            <v-list-item-subtitle>{{ c.vuÀ }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </div>
      <div v-else>
        <v-list
          v-if="connexionsSFIP"
          max-height="500"
          style="overflow-y: scroll;"
        >
          <v-list-item
            v-for="c in connexionsSFIP"
            :key="c.adresse"
          >
            <template #prepend>
              <v-icon>mdi-web</v-icon>
            </template>
            <v-list-item-title>{{ c.adresse }}</v-list-item-title>
            <v-list-item-subtitle>{{ c.pair }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import type { statutDispositif } from '@constl/ipa/dist/src/reseau';

import { computed, inject, ref } from 'vue';
import { enregistrerÉcoute } from '/@/composables/utils';
import DivisionCarte from '../communs/DivisionCarte.vue';
import { கிளிமூக்கை_உபயோகி } from '/@/plugins/kilimukku/kilimukku-vue';

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Navigation
const typeConnexions = ref<'SFIP' | 'Constellation'>('Constellation');
const titreDivision = computed(()=>{
    switch (typeConnexions.value) {
        case 'SFIP':
            return t('compte.connexions.titreSFIP');
        case 'Constellation':
            return t('compte.connexions.titreConstellation');
        default:
            return '';
    }
});

// Connexions SFIP
const connexionsSFIP = ref<{
    adresse: string;
    pair: string;
}[]>();
enregistrerÉcoute(
    constl?.réseau?.suivreConnexionsPostesSFIP({
        f: x=>connexionsSFIP.value = x,
    }),
);

// Connexions Constellation
const connexionsConstellation = ref<statutDispositif[]>();
enregistrerÉcoute(
    constl?.réseau?.suivreConnexionsDispositifs({
        f: x=>connexionsConstellation.value = x,
    }),
);


</script>