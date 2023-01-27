<template>
  <v-list>
    <v-list-item>
      <v-row>
        <v-col cols="4">
          <v-autocomplete
            hide-details
            density="compact"
            variant="outlined"
          ></v-autocomplete>
        </v-col>
        <v-col cols="8">
          <v-text-field
            hide-details
            density="compact"
            variant="outlined"
          ></v-text-field>
        </v-col>
      </v-row>
      <template #append>
        <v-btn
          icon="mdi-plus"
          variant="text"
        ></v-btn>
      </template>
    </v-list-item>
    <v-divider class="mb-2" />
    <v-list-item>
      <v-list-item-title>
        <v-row>
          <v-col cols="4">
            <v-autocomplete
              hide-details
              density="compact"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="8">
            <v-text-field
              hide-details
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-list-item-title>
      <template #append>
        <v-btn
          icon="mdi-delete"
          variant="text"
        ></v-btn>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';


defineProps<{
    noms: {[lng: string]: string}
}>();
defineEmits<{
    (é: 'ajusterNoms', noms: {[lng: string]: string}): void
}>();


</script>
