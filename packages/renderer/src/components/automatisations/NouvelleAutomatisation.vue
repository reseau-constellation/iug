<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex align-center">
          {{ t('') }} Ajout d'automatisation
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          />
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <v-list>
          <nouvelle-importation>
            <template #activateur="{props: propsActivateur}">
              <v-list-item
                prepend-icon="mdi-import"
                v-bind="propsActivateur"
              >
                Importer
              </v-list-item>
            </template>
          </nouvelle-importation>
          <nouvelle-exportation>
            <template #activateur="{props: propsActivateur}">
              <v-list-item
                prepend-icon="mdi-export"
                v-bind="propsActivateur"
              >
                Exporter
              </v-list-item>
            </template>
          </nouvelle-exportation>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ref} from 'vue';
import {useDisplay} from 'vuetify';

import NouvelleExportation from './NouvelleExportation.vue';
import NouvelleImportation from './NouvelleImportation.vue';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);
</script>
