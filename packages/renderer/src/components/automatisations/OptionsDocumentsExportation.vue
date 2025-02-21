<template>
  <v-checkbox
    v-model="inclureDocuments"
    color="primary"
    hide-details
  >
    <template #label>
      {{ t('exportations.carte.étiquetteInclureDocuments') }}
      <v-tooltip
        v-if="!écranTactile"
        location="bottom"
        :text="t('exportations.carte.indiceInclureDocuments')"
      >
        <template #activator="{props: propsActivateur}">
          <v-icon
            v-bind="propsActivateur"
            icon="mdi-information-outline"
            end
          ></v-icon>
        </template>
      </v-tooltip>
    </template>
  </v-checkbox>
</template>
<script setup lang="ts">
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {plateforme} from '/@/utils';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const {so} = plateforme();
const écranTactile = so === 'androïde' || so === 'iOS';

const inclureDocuments = defineModel<boolean>();
</script>
