<template>
  <v-list-item>
    <template #prepend>
      <icone-epingle :id="id" />
    </template>
    <v-list-item-title>
      {{ epingle ? t('épingler.épinglé') : t('épingler.épingler') }}
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import IconeEpingle from '/@/components/épingles/IcôneÉpingle.vue';

defineProps<{epingle: boolean; id: string}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
</script>
