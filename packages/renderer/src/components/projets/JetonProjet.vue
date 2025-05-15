<template>
  <v-chip
    v-bind="$attrs"
    variant="outlined"
  >
    <v-avatar start>
      <v-img :src="srcImgProjet || imgDéfaut"></v-img>
    </v-avatar>
    {{ nomTraduit || t('projets.sansNom') }}
    <slot></slot>
  </v-chip>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed} from 'vue';

import {மொழிகளைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '/@/components/utils';
import {utiliserImagesDéco} from '/@/composables/images';
import {sourceImage} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

// Nom du projet
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = suivre(constl.projets.suivreNomsProjet, {idProjet: computed(() => props.id)});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Image
const imageProjet = suivre(constl.projets.suivreImage, {idProjet: computed(() => props.id)});
const srcImgProjet = sourceImage(imageProjet);

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('logoBD');
</script>
