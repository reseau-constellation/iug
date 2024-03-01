<template>
  <v-chip
    variant="outlined"
    size="small"
  >
    {{ code || t('communs.auto') }}
    {{ numéroFormatté }}
  </v-chip>
</template>
<script setup lang="ts">
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {எண்களைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{code: string}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const {எண்ணை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();

const numéroFormatté = எண்ணை_வடிவூட்டு(123.45, props.code);
</script>
