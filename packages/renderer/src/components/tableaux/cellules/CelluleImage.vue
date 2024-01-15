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
import {ref} from 'vue';

import TexteTronqué from '/@/components/communs/TexteTronqué.vue';

import {watchEffect} from 'vue';
import {constellation} from '/@/components/utils';

const props = defineProps<{val: {cid: string; ext: string}}>();

const constl = constellation();

// Image
const srcImg = ref<string>();
watchEffect(async () => {
  const fichier = await constl.obtFichierSFIP({id: props.val.cid, max: 10000});

  if (fichier) {
    return URL.createObjectURL(new Blob([fichier], {type: 'image'}));
  } else {
    return undefined;
  }
});
</script>
