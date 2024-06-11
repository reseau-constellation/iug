<template>
  <span v-if="valValide">
    {{ valValide }}
  </span>
  <v-icon
    v-else
    size="small"
    color="error"
    icon="mdi-error"
  />
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';
import { computed } from 'vue';
const props = defineProps<{val?: types.élémentsBd}>();


const valValide = computed<[string, string] | undefined>(()=>{
  if (!Array.isArray(props.val) || props.val.length !== 2) return undefined;
  const formattées = props.val.map(t => {
    if (typeof t !== 'number' || typeof t !== 'string') return undefined;
    try {
      return new Date(t).toLocaleDateString();
    } catch {
      return undefined;
    }
  });
  return formattées.every(t=>!!t) ? formattées as [string, string] : undefined;
});
</script>
