<template>
  <v-list-item prepend-icon="mdi-database-check-outline">
    <v-list-item-title>
      {{ t('nuées.bds.item.titre', nBdsDeNuée) }}
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import {rechercher} from '@constl/vue';
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import {utiliserConstellation} from '../utils';

const props = defineProps<{idNuee: string}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const constl = utiliserConstellation();

const {résultats: bdsDeNuée} = rechercher(constl.nuées.suivreBdsCorrespondantes, {
  idNuée: computed(() => props.idNuee),
});
const nBdsDeNuée = computed(() => bdsDeNuée.value?.length);
</script>
