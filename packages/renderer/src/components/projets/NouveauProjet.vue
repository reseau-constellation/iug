<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props}">
      <slot
        name="activator"
        v-bind="{props}"
      ></slot>

      <v-card
        class="mx-auto"
        :width="mdAndUp ? 500 : 300"
      >
        <v-card-item>
          <v-card-title class="text-h5 justify-space-between">
            <span>{{ titreCarte }}</span>
          </v-card-title>
          <v-card-subtitle> {{ sousTitreCarte }} </v-card-subtitle>
        </v-card-item>
        <v-card-text>
          <v-window
            v-model="étape"
            style="overflow-y: auto"
          >
          </v-window>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
<script setup lang="ts">
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = ['Noms', 'Descriptions', 'MotsClefs', 'AjouterBds', 'Confirmation'];

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      return '';
  }
});
</script>
