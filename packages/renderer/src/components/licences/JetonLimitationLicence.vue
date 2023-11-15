<template>
  <v-tooltip location="bottom">
    <template #activator="{props}">
      <v-chip
        v-bind="props"
        variant="outlined"
        size="small"
        label
        class="ma-1 my-1"
      >
        <v-icon
          start
          color="error"
        >
          mdi-close
        </v-icon>
        {{ t(`licences.limitations.${limitation}`) }}
      </v-chip>
    </template>
    <span>{{ t(`licences.détails.limitations.${limitation}`) }}</span>
  </v-tooltip>
</template>

<script setup lang="ts">
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';

defineProps<{limitation: string}>();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
</script>

<style></style>
