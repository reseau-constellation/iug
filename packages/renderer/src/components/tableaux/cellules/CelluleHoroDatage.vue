<template>
  <span>{{ dateFormattée }}</span>
  <v-icon
    v-if="!valValide"
    size="small"
    color="error"
    icon="mdi-error"
  />
</template>
<script setup lang="ts">
import type { types } from '@constl/ipa';
import { computed } from 'vue';

const props = defineProps<{val?: types.élémentsBd}>();

const valValide = computed(()=>{
  if (typeof props.val === 'number') return props.val;
  else return false;
});

const dateFormattée = computed(()=>{
  if (!valValide.value) return undefined;
  return new Date(valValide.value).toLocaleDateString();
});
</script>
