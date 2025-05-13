<template>
  <v-chip
    v-bind="$attrs"
    variant="outlined"
    label
  >
    <v-avatar start>
      <v-img :src="srcImgBd || imgDéfaut"></v-img>
    </v-avatar>
    {{ nomTraduit || t('bds.sansNom') }}
    <slot></slot>
  </v-chip>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed} from 'vue';

import {மொழிகளைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '/@/components/utils';
import {utiliserImagesDéco} from '/@/composables/images';
import { sourceImage } from '/@/utils';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

// Nom de la Bd
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = suivre(constl.bds.suivreNomsBd, {idBd: computed(() => props.id)});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Image
const imageBd = suivre(constl.bds.suivreImage, {idBd: computed(() => props.id)});
const srcImgBd = sourceImage(imageBd);

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('logoBD');
</script>
