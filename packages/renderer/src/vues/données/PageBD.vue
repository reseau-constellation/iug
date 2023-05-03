<template>
  <h1>Ici</h1>
  <p>{{ id }}</p>
</template>
<script setup lang="ts">
defineProps<{id: string}>();
</script>
