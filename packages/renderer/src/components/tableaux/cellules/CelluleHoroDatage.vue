<template>
  <template v-if="editable">
    {{ dateFormattée }}
    <selecteur-date
      :originale="valValide"
      @modifiee="({val}) => (valFinale = val)"
    >
      <template #activateur="{props: propsActivateur}">
        <v-icon
          v-bind="propsActivateur"
          icon="mdi-calendar-clock"
        />
      </template>
    </selecteur-date>
  </template>
  <template v-else>
    <span>{{ dateFormattée }}</span>
  </template>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';
import {computed, ref, watch} from 'vue';

import SelecteurDate from './SélecteurDate.vue';

const props = defineProps<{val?: types.élémentsBd; editable: boolean}>();
const émettre = defineEmits<{(é: 'modifiee', args: {val?: number}): void}>();

const valValide = computed(() => {
  if (typeof props.val === 'number') return props.val;
  else return undefined;
});

const dateFormattée = computed(() => {
  if (!valValide.value) return undefined;
  return new Date(valValide.value).toLocaleDateString();
});

// Modifications
const valFinale = ref(valValide.value);
watch(valFinale, () => {
  émettre('modifiee', {val: valFinale.value || undefined});
});
</script>
