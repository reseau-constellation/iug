<template>
  <v-list-group :value="info.clef">
    <template #activator="{props}">
      <v-list-item
        v-bind="props"
        prepend-icon="mdi-account-circle"
      >
        <v-list-item-title> </v-list-item-title>
      </v-list-item>
    </template>
    <v-list-item>
      <template #prepend>
        <v-icon> mdi-plus </v-icon>
      </template>
    </v-list-item>
    <ItemSpécificationColonne
      v-for="col in colonnes"
      :key="col.id"
    />
  </v-list-group>
</template>

<script setup lang="ts">
import type {bds, tableaux} from '@constl/ipa';

import ItemSpécificationColonne from './ItemSpécificationColonne.vue';

defineProps<{
  info: bds.infoTableau;
  idTableau?: string;
  colonnes: tableaux.InfoColAvecCatégorie[];
}>();
</script>
