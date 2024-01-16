<template>
  <v-list-item
    :prepend-avatar="srcImgProjet || imgDéfaut"
    :title="nomTraduit"
    :subtitle="descrTraduite"
  >
    <slot></slot>
  </v-list-item>
</template>
<script setup lang="ts">
import {computed} from 'vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {constellation, suivre} from '/@/components/utils';

const props = defineProps<{id: string}>();

const constl = constellation();

// Nom du projet
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = suivre(constl.projets.suivreNomsProjet, {idProjet: props.id}, {});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Description du projet
const descriptions = suivre(constl.projets.suivreDescriptionsProjet, {idProjet: props.id}, {});
const descrTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);

// Image
const imageProjet = suivre(constl.projets.suivreImage, {idProjet: props.id});
const srcImgProjet = computed(() => {
  if (imageProjet.value) {
    return URL.createObjectURL(new Blob([imageProjet.value], {type: 'image'}));
  } else {
    return undefined;
  }
});

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('logoBD');
</script>
