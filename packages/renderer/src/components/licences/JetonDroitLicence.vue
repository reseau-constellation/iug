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
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

defineProps<{droit: string}>();
const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
</script>
