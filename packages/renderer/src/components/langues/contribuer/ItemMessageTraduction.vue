<template>
  <v-list-item :active="actif">
    <template #append>
      <v-icon
        v-if="traductionApprouvee"
        color="primary"
        icon="mdi-check"
      ></v-icon>
      <v-badge
        v-else-if="suggestions.length"
        :content="nSuggestionsFormattée"
        color="secondary"
        location="bottom end"
      >
        <v-icon>mdi-hand-pointing-up</v-icon>
      </v-badge>
    </template>
    <v-list-item-title>
      {{ traductionLangueSource || t('languesInterface.dialogueContribuer.aucuneTraduction') }}
    </v-list-item-title>
    <v-list-item-subtitle>{{ clef }}</v-list-item-subtitle>
  </v-list-item>
</template>

<script setup lang="ts">
import {computed} from 'vue';

import type {பிணையம்_மொழிபெயர்ப்பு_பரிந்துரை_வகை} from '@lassi-js/kilimukku';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {எண்களைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{
  clef: string;
  actif: boolean;
  traductionApprouvee?: string;
  traductionLangueSource?: string;
  suggestions: பிணையம்_மொழிபெயர்ப்பு_பரிந்துரை_வகை[];
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const {எண்ணை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();

const nSuggestions = computed(() => {
  return props.suggestions.length;
});
const nSuggestionsFormattée = எண்ணை_வடிவூட்டு(nSuggestions);
</script>
