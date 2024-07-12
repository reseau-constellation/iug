<template>
  <v-avatar
    :image="srcImgProfil || imgDéfaut"
    v-bind="props"
  />
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed} from 'vue';

import {utiliserConstellation} from '/@/components/utils';
import {utiliserImagesDéco} from '/@/composables/images';

const props = defineProps<{id?: string}>();

const constl = utiliserConstellation();

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
