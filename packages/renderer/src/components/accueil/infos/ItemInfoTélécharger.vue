<template>
  <v-list-item>
    <v-list-item-title> </v-list-item-title>
    <v-list-item-action>
      <v-slot />
    </v-list-item-action>
  </v-list-item>
</template>
<script setup lang="ts">
import type {InfoAvecId, InfoInstaller} from '/@/état/infos';

defineProps<{
  info: InfoAvecId<InfoInstaller>;
}>();
</script>
