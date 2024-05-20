<template>
  <v-checkbox
    :model-value="val"
    :indeterminate="typeof val === 'undefined'"
  />
</template>
<script setup lang="ts">
defineProps<{val?: boolean}>();
</script>
