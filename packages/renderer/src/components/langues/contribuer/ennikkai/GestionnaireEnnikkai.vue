<template>
  <v-dialog
    :max-width="mdAndUp ? 700 : 300"
    class="mx-auto"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      >
        <v-list-item
          v-bind="propsActivateur"
          density="compact"
          prepend-icon="mdi-plus"
          :title="t('ennikkai.ajouter')"
        />
      </slot>
    </template>
    <v-card>
      <v-card-title>À faire</v-card-title>
      <v-card-text>À faire</v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
// À faire : composante non utilisée
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {useDisplay} from 'vuetify';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const {mdAndUp} = useDisplay();
</script>
