<template>
  <p class="text-disabled font-weight-light">
    {{ t(`règles.source.${source.type}`) }}
  </p>
</template>
<script setup lang="ts">
import type {valid} from '@constl/ipa';
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
defineProps<{
  source: valid.sourceRègle;
}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
</script>
