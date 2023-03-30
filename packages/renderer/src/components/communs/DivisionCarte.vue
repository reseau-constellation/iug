<template>
  <p class="text-overline">{{ titre }}</p>
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
defineProps<{titre: string; enAttente: boolean}>();
</script>
