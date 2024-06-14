<template>
  <span v-if="valValide">
    <v-icon icon="mdi-location" />
    {{ valValide }}
  </span>
</template>
<script setup lang="ts">
import gjv from 'geojson-validation';

import type {types} from '@constl/ipa';
import { computed } from 'vue';
const props = defineProps<{val?: types.élémentsBd}>();

const valValide = computed<types.élémentsBd | undefined>(()=>{
  if (gjv.valid(props.val)) return props.val;
  else return undefined;
});

</script>
