<template>
  <v-checkbox
    v-if="editable"
    v-model="valFinale"
    :readonly="!editable"
    density="compact"
    hide-details
  />
  <v-icon
    v-else-if="valFinale !== undefined"
    :icon="valFinale ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
  />
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';
import {computed, ref, watch, watchEffect} from 'vue';

const props = defineProps<{val?: types.élémentsBd; editable: boolean}>();
const émettre = defineEmits<{(é: 'modifiee', args: {val?: boolean}): void}>();

const valValide = computed(() => {
  return typeof props.val === 'boolean' ? props.val : undefined;
});
const valFinale = ref(valValide.value);
watchEffect(() => {
  valFinale.value = valValide.value;
});

watch(valFinale, () => {
  émettre('modifiee', {val: valFinale.value});
});
</script>
