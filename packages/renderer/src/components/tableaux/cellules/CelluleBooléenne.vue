<template>
  <v-checkbox
    :model-value="val"
    :indeterminate="val === undefined"
  />
</template>
<script setup lang="ts">
import type { types } from '@constl/ipa';

defineProps<{val?: types.élémentsBd}>();
</script>
