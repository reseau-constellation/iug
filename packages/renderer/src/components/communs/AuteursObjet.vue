<template>
  <SérieJetons
    :items="items"
    :n-max="nMax"
  >
    <template #jeton="{idBdCompte}">
      <CarteMembre :id="idBdCompte as string">
        <template #activator="{props: propsActivateurJetonMembre}">
          <JetonMembre
            v-bind="propsActivateurJetonMembre"
            :compte="idBdCompte as string"
          />
        </template>
      </CarteMembre>
    </template>
    <template #itemListe="{id}">
      <CarteMembre :id="id">
        <template #activator="{props: propsActivateurItemMembre}">
          <ItemMembre
            v-bind="propsActivateurItemMembre"
            :compte="id"
            :montrer-anonymes="true"
          ></ItemMembre>
        </template>
      </CarteMembre>
    </template>
  </SérieJetons>
</template>
<script setup lang="ts">
import type {utils} from '@constl/ipa';

import {computed} from 'vue';
import type {PropType} from 'vue';

import ItemMembre from '/@/components/membres/ItemMembre.vue';
import JetonMembre from '/@/components/membres/JetonMembre.vue';
import SérieJetons from './SérieJetons.vue';
import CarteMembre from '../membres/CarteMembre.vue';

const props = defineProps({
  auteurs: {
    type: Array as PropType<utils.infoAuteur[]>,
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
