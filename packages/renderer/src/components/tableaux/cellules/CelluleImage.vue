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
    :texte="val.cid"
    :longueur-max="10"
  />
</template>
<script setup lang="ts">
import type {client} from '@constl/ipa';

import {inject, ref} from 'vue';

import TexteTronqué from '/@/components/communs/TexteTronqué.vue';

import {watchEffect} from 'vue';

const props = defineProps<{val: {cid: string; ext: string}}>();

const constl = inject<client.ClientConstellation>('constl');

// Image
const srcImg = ref<string>();
watchEffect(async () => {
  const fichier = await constl?.obtFichierSFIP({id: props.val.cid, max: 10000});

  if (fichier) {
    return URL.createObjectURL(new Blob([fichier], {type: 'image'}));
  } else {
    return undefined;
  }
});
</script>
