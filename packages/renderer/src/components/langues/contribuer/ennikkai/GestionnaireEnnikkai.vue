<template>
  <v-dialog
    :max-width="mdAndUp ? 700 : 300"
    class="mx-auto"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      >
        <v-list-item
          v-bind="propsActivateur"
          density="compact"
          prepend-icon="mdi-plus"
          :title="t('ennikkai.ajouter')"
        ></v-list-item>
      </slot>
    </template>
    <v-card>
      <v-card-title>À faire</v-card-title>
      <v-card-text>À faire</v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import { useDisplay } from 'vuetify';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const {mdAndUp} = useDisplay();

</script>