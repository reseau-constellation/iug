<template>
  <v-checkbox
    v-model="valFinale"
    :readonly="!editable"
  />
</template>
<script setup lang="ts">
import type { types } from '@constl/ipa';
import { computed, ref, watchEffect, watch } from 'vue';

const props = defineProps<{val?: types.élémentsBd, editable: boolean}>();
const émettre = defineEmits<{(é: 'modifiee', args: {val?: boolean}): void;}>();

const valValide = computed(()=>{
  return typeof props.val === 'boolean' ? props.val : undefined;
});
const valFinale = ref(valValide.value);
watchEffect(()=>{
  valFinale.value = valValide.value;
});

watch(valFinale, ()=>{
  émettre('modifiee', {val: valFinale.value});
});

</script>
