<template>
  <SérieJetons
    :items="items"
    :n-max="nMax"
  >
    <template #jeton="{idBdCompte}">
      <JetonMembre :compte="idBdCompte as string" />
    </template>
    <template #itemListe="{id}">
      <ItemMembre
        :compte="id"
        :montrer-anonymes="true"
      ></ItemMembre>
    </template>
  </SérieJetons>
</template>
<script setup lang="ts">
import type {infoAuteur} from '@constl/ipa/dist/src/utils';

import {computed} from 'vue';
import type {PropType} from 'vue';

import ItemMembre from '/@/components/membres/ItemMembre.vue';
import JetonMembre from '/@/components/membres/JetonMembre.vue';
import SérieJetons from './SérieJetons.vue';

const props = defineProps({
  auteurs: {
    type: Array as PropType<infoAuteur[]>,
    default: () => [],
  },
  nMax: {
    type: Number,
    default: 3,
  },
});

const items = computed(() => {
  return props.auteurs?.map(a => ({id: a.idBdCompte, ...a}));
});
</script>
