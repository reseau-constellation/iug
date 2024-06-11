<template>
  <v-img
    v-if="srcImg"
    :src="srcImg"
  />
  <v-icon
    v-else
    icon="mdi-photo"
  />
  <TexteTronqué
    v-if="valValide"
    :texte="valValide.id"
    :longueur-max="10"
  />
</template>
<script setup lang="ts">
import type { types } from '@constl/ipa';

import {computed, ref, watchEffect} from 'vue';

import TexteTronqué from '/@/components/communs/TexteTronqué.vue';

import {constellation, idcEtExt} from '/@/components/utils';


const props = defineProps<{val?: types.élémentsBd}>();

const constl = constellation();

const valValide = computed(()=>{
  if (typeof props.val === 'string') {
    return idcEtExt(props.val);
  }
  return undefined;
});

// Image
const srcImg = ref<string>();
watchEffect(async () => {
  if (!valValide.value) return undefined;
  const fichier = await constl.obtFichierSFIP({id: valValide.value?.id, max: 10000});

  if (fichier) {
    return URL.createObjectURL(new Blob([fichier], {type: 'image'}));
  } else {
    return undefined;
  }
});
</script>
