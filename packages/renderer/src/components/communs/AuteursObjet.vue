<template>
  <SérieJetons
    :items="items"
    :n-max="3"
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
import ItemMembre from '../membres/ItemMembre.vue';
import JetonMembre from '../membres/JetonMembre.vue';
import SérieJetons from './SérieJetons.vue';

const props = defineProps<{auteurs?: infoAuteur[]}>();

const items = computed(() => {
  return props.auteurs?.map(a => ({id: a.idBdCompte, ...a}));
});
</script>
