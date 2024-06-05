<template>
  <v-list-item>
    <template #title>{{ code }}</template>
  </v-list-item>
</template>
<script setup lang="ts">
import type {எண்_வகை} from 'ennikkai';

defineProps<{
  code: string;
  infos: எண்_வகை;
}>();
</script>
