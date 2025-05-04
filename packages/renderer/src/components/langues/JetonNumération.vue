<template>
  <v-chip
    variant="outlined"
    size="small"
    label
  >
    <slot>
      {{ code || t('communs.auto') }}
    </slot>
    {{ numéroFormatté }}
  </v-chip>
</template>
<script setup lang="ts">
import {எண்களைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{code: string}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const {எண்ணை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();

const numéroFormatté = எண்ணை_வடிவூட்டு(123.45, props.code);
</script>
