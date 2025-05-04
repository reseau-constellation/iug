<template>
  <v-btn
    variant="flat"
    append-icon="mdi-close"
  >
    {{ t('communs.annuler') }}
  </v-btn>
</template>
<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
</script>
