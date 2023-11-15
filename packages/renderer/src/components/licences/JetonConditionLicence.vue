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
          color="blue"
        >
          mdi-information-outline
        </v-icon>
        {{ t(`licences.conditions.${condition}`) }}
      </v-chip>
    </template>
    <span>{{ t(`licences.détails.conditions.${condition}`) }}</span>
  </v-tooltip>
</template>

<script setup lang="ts">
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
defineProps<{condition: string}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
</script>
