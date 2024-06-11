<template>
  <v-icon icon="mdi-audio" />
  <TexteTronque
    v-if="valValide"
    :texte="valValide.fichier"
    :longueur-max="10"
  />
</template>
<script setup lang="ts">
import type { types } from '@constl/ipa';

import { computed } from 'vue';
import TexteTronque from '/@/components/communs/TexteTronqué.vue';
import { idcEtExt } from '/@/components/utils';

const props = defineProps<{val?: types.élémentsBd}>();
const valValide = computed(()=>{
  if (typeof props.val === 'string') {
    return idcEtExt(props.val);
  }
  return undefined;
});
</script>
