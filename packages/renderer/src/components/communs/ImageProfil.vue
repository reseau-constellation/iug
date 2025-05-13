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
import { sourceImage } from '/@/utils';

const props = defineProps<{id?: string}>();

const constl = utiliserConstellation();

/* Uniquement inclure `idCompte` si `props.id !== undefined`. Sinon, `suivre` attend que la valeur soit 
définie avant de rendre le résultat.
*/
const imageProfil = suivre(
  constl.profil.suivreImage,
  props.id ? {idCompte: computed(() => props.id)} : undefined,
);
const srcImgProfil = sourceImage(imageProfil);

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('profil');
</script>
