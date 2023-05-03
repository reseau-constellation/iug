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
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
defineProps<{condition: string}>();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
</script>
