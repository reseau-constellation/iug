<template>
  <p class="mt-2 font-weight-bold">{{ titre }}</p>
  <v-progress-linear
    v-if="enAttente"
    class="mb-2"
    indeterminate
    :height="1"
  />
  <v-divider
    v-else
    class="mb-2"
  />
</template>
<script setup lang="ts">
defineProps({titre: {type: String, required: true }, enAttente: {type: Boolean, default: false}});
</script>
