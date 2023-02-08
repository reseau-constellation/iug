<template>
  <v-dialog>
    <template #activator="{props}">
      <slot
        name="activator"
        v-bind="{props}"
      ></slot>
    </template>

    <v-card
      class="mx-auto"
      :width="mdAndUp ? 750 : 300"
    >
      <v-card-item>
        <v-card-title>Contribuer</v-card-title>
        <v-card-subtitle>Ajoutez des traductions à Constellation</v-card-subtitle>
      </v-card-item>

      <v-card-text>
        <v-select variant="outlined"></v-select>
        <v-select variant="outlined"></v-select>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {useDisplay} from 'vuetify';

const {mdAndUp} = useDisplay();
</script>
