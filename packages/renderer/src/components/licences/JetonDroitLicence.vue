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
          color="success"
        >
          mdi-check
        </v-icon>
        {{ t(`licences.droits.${droit}`) }}
      </v-chip>
    </template>
    <span>{{ t(`licences.détails.droits.${droit}`) }}</span>
  </v-tooltip>
</template>

<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
defineProps<{droit: string}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
</script>
