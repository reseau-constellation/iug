<template>
  <p class="text-overline">{{ titre }}</p>
  <v-divider class="mb-2" />
</template>
<script setup lang="ts">
defineProps<{titre: string}>();
</script>
