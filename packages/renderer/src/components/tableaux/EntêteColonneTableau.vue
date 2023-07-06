<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title></v-card-title>
        <v-card-subtitle></v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <v-checkbox></v-checkbox>
      </v-card-text>
      <v-card-actions></v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useDisplay} from 'vuetify/lib/framework.mjs';

defineProps<{
  permissionModifier?: 'MODÉRATEUR' | 'MEMBRE';
  idVariable: string;
  idColonne: string;
  idTableau: string;
  index: boolean;
}>();

const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);
</script>
