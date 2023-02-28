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
        <template #itemListe="{idBd}">
          <ItemBd
            :compte="idBd"
            :montrer-anonymes="true"
          />
        </template>
      </SérieJetons>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import type {schémaFonctionOublier} from '@constl/ipa/dist/src/utils';
import {ref, inject, onMounted, onUnmounted} from 'vue';
import SérieJetons from '/@/components/communs/SérieJetons.vue';
import ItemBd from '/@/components/bds/ItemBd.vue';
import JetonBd from '/@/components/bds/JetonBd.vue';


const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

// Bds
const bdsMembre = ref<string[]>();
let fOublierBdsMembre: schémaFonctionOublier | undefined = undefined;
onMounted(async () => {
  fOublierBdsMembre = await constl?.réseau?.suivreBdsMembre({
    idCompte: props.id,
    f: bds => (bdsMembre.value = bds),
  });
});
onUnmounted(async () => {
  if (fOublierBdsMembre) fOublierBdsMembre();
});
</script>
