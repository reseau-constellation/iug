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

/* Uniquement inclure `idCompte` si `props.id !== undefined`. Sinon, `suivre` attend que la valeur soit 
définie avant de rendre le résultat.
*/
const imageProfil = suivre(constl.profil.suivreImage, props.id ? {idCompte: props.id} : undefined);
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
