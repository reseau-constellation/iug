<template>
  <v-text-field
    v-if="editable"
    v-model="valFinale"
    hide-details
    density="compact"
    variant="outlined"
  />
  <p v-else>{{ valFormattée }}</p>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import {computed, ref, watchEffect} from 'vue';

import {எண்களைப்_பயன்படுத்து, எண்ணிக்கையை_கண்டுப்பிடி} from '@lassi-js/kilimukku-vue';
import {watch} from 'vue';

const props = defineProps<{val: types.élémentsBd; editable: boolean}>();
const émettre = defineEmits<{
  (é: 'modifiee', args: {val?: number}): void;
}>();

const எண்ணிக்கை = எண்ணிக்கையை_கண்டுப்பிடி();
const {எண்ணை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();

const valValide = computed(() => (typeof props.val === 'number' ? props.val : undefined));
const valFormattée = எண்ணை_வடிவூட்டு(valValide);
const valFinale = ref('');
watchEffect(() => {
  valFinale.value = valFormattée.value || '';
});

const valFinaleNumérique = computed(() => {
  try {
    return எண்ணிக்கை.எண்ணுக்கு({உரை: valFinale.value});
  } catch {
    return undefined;
  }
});

watch(valFinaleNumérique, () => {
  émettre('modifiee', {val: valFinaleNumérique.value});
});
</script>
