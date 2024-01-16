<template>
  <v-avatar
    :image="srcImgProfil || imgDéfaut"
    v-bind="props"
  />
</template>
<script setup lang="ts">
import {computed} from 'vue';

import {utiliserImagesDéco} from '/@/composables/images';
import {constellation, suivre} from '/@/components/utils';

const props = defineProps<{id?: string}>();

const constl = constellation();

const imageProfil = suivre(constl.profil.suivreImage, {idCompte: props.id});
const srcImgProfil = computed(() => {
  if (imageProfil.value) {
    return URL.createObjectURL(new Blob([imageProfil.value], {type: 'image'}));
  } else {
    return undefined;
  }
});

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('profil');
</script>
