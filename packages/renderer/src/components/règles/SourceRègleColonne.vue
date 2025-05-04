<template>
  <p class="text-disabled font-weight-light">
    {{ t(`règles.source.${source.type}`) }}
  </p>
</template>
<script setup lang="ts">
import type {valid} from '@constl/ipa';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

defineProps<{
  source: valid.sourceRègle;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
</script>
