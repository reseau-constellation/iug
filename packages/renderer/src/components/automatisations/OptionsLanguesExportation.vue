<template>
  <v-autocomplete
    v-model="langues"
    :items="languesDisponibles"
    :label="t('exportations.carte.étiquetteLangues')"
    variant="outlined"
    multiple
    chips
    closable-chips
    hide-details
  />
</template>
<script setup lang="ts">
import {
  கிடைக்கும்_மொழிகளைப்_பயன்படுத்து,
  மொழிகளைப்_பயன்படுத்து,
  மொழியாக்கத்தைப்_பயன்படுத்து,
} from '@lassi-js/kilimukku-vue';
import {computed, watchEffect} from 'vue';

const langues = defineModel<string[]>();
const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const {மொழி, மாற்றுமொழிகள்} = மொழிகளைப்_பயன்படுத்து();
const {மொழிகளும்_குறியீடுகளும்} = கிடைக்கும்_மொழிகளைப்_பயன்படுத்து();

const languesDisponibles = computed(() => மொழிகளும்_குறியீடுகளும்.value.map(lng => lng.மொழி));
watchEffect(() => {
  langues.value = [மொழி.value, ...மாற்றுமொழிகள்.value].map(
    code => மொழிகளும்_குறியீடுகளும்.value.find(lng => lng.குறியீடு === code)?.மொழி || code,
  );
});
</script>
