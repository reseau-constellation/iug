<template>
  <v-card>
    <v-card-text>
      <SérieJetons
        v-if="bdsMembre"
        :items="bdsMembre"
        :n-max="5"
      >
        <template #jeton="{id: idBd}">
          <JetonBd :id="idBd" />
        </template>
        <template #itemListe="{id: idBd}">
          <ItemBd
            :id="idBd"
            :montrer-anonymes="true" 
          />
        </template>
      </SérieJetons>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import {enregistrerÉcoute} from '/@/composables/utils';

import {ref, inject} from 'vue';
import SérieJetons from '/@/components/communs/SérieJetons.vue';
import ItemBd from '/@/components/bds/ItemBd.vue';
import JetonBd from '/@/components/bds/JetonBd.vue';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

// Bds
const bdsMembre = ref<string[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreBdsMembre({
    idCompte: props.id,
    f: bds => (bdsMembre.value = bds),
  }),
);
</script>
