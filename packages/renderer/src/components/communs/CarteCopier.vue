<template>
  <v-dialog
    v-model="dialogue"
    :max-width="mdAndUp ? 500 : 300"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card>
      <v-card-item>
        <v-card-title> </v-card-title>
      </v-card-item>
      <v-card-text> </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useDisplay} from 'vuetify';

const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);
</script>
