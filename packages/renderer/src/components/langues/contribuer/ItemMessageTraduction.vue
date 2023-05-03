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

import type {பிணையம்_மொழிபெயர்ப்பு_பரிந்துரை_வகை} from '/@/plugins/kilimukku/கிளிமூக்கு';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserNumération} from '/@/plugins/localisation/localisation';

const props = defineProps<{
  clef: string;
  actif: boolean;
  traductionApprouvee?: string;
  traductionLangueSource?: string;
  suggestions: பிணையம்_மொழிபெயர்ப்பு_பரிந்துரை_வகை[];
}>();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {formatterChiffre} = utiliserNumération();

const nSuggestions = computed(() => {
  return props.suggestions.length;
});
const nSuggestionsFormattée = formatterChiffre(nSuggestions);
</script>
