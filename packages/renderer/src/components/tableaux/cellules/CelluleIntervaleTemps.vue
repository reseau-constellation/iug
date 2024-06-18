<template>
  <template v-if="editable">
    <selecteur-date
      :originale="valValide?.[0]"
      @modifiee="({val})=>valDébut = val"
    >
      <template #activator="{props: propsActivateur}">
        <v-icon
          v-bind="propsActivateur"
          icon="mdi-calendar-clock"
        />
      </template>
    </selecteur-date>
    <v-icon icon="mdi-minus" />
    <selecteur-date
      :originale="valValide?.[1]"
      @modifiee="({val})=>valFin = val"
    >
      <template #activator="{props: propsActivateur}">
        <v-icon
          v-bind="propsActivateur"
          icon="mdi-calendar-clock"
        />
      </template>
    </selecteur-date>
  </template>
  <template v-else>
    <span>{{ valValide }}</span>
  </template>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';
import { computed, ref, watch } from 'vue';

import SelecteurDate from './SélecteurDate.vue';

const props = defineProps<{val?: types.élémentsBd, editable: boolean}>();
const émettre = defineEmits<{(é: 'modifiee', args: {val?: [number, number]}): void;}>();


const valValide = computed<[number, number] | undefined>(()=>{
  if (!Array.isArray(props.val) || props.val.length !== 2) return undefined;
  const formattées = props.val.map(t => {
    if (typeof t !== 'number' || typeof t !== 'string') return undefined;
    try {
      return new Date(t).getTime();
    } catch {
      return undefined;
    }
  });
  return formattées.every(t=>!!t) ? formattées as [number, number] : undefined;
});

// Modifications
const valDébut = ref(valValide.value?.[0]);
const valFin = ref(valValide.value?.[1]);
const valFinale = computed<[number, number] | undefined>(()=>{
  if (valDébut.value && valFin.value) return [valDébut.value, valFin.value];
  else return undefined;
});
watch(valFinale, ()=>{
  émettre('modifiee', {val: valFinale.value});
});
</script>
