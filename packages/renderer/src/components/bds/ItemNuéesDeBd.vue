<template>
  <v-list-item prepend-icon="mdi-database-check-outline">
    <v-list-item-title>
      {{ t('bds.nuées.item.titre', nNuéesDeBds) }}
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import {utiliserConstellation} from '../utils';

const props = defineProps<{idBd: string}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const constl = utiliserConstellation();

const nuéesDeBds = suivre(constl.bds.suivreNuéesBd, {
  idBd: computed(() => props.idBd),
});
const nNuéesDeBds = computed(() => nuéesDeBds.value?.length);
</script>
