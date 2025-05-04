<template>
  <v-list-item prepend-icon="mdi-account-multiple-check-outline">
    <v-list-item-title>
      {{ t('nuées.autorisations.item.titre') }}
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

defineProps<{idNuee: string}>();
</script>
