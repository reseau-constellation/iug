<template>
  <v-list-item
    :prepend-avatar="srcImgNuée || imgDéfaut"
    :title="nomTraduit || t('nuées.sansNom')"
    :subtitle="descrTraduite || t('communs.baseCarteObjet.sansDescription')"
  >
    <template #append>
      <lien-objet :id="id"></lien-objet>
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import {computed} from 'vue';
import {suivre} from '@constl/vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import LienObjet from '../communs/LienObjet.vue';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Nom de la nuée

const noms = suivre(constl.nuées.suivreNomsNuée, {idNuée: props.id});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Description de la nuée
const descriptions = suivre(constl.nuées.suivreDescriptionsNuée, {idNuée: props.id});
const descrTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);

// Image
const imageNuée = suivre(constl.nuées.suivreImage, {idNuée: props.id});
const srcImgNuée = computed(() => {
  if (imageNuée.value) {
    return URL.createObjectURL(new Blob([imageNuée.value], {type: 'image'}));
  } else {
    return undefined;
  }
});

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('logoBD');
</script>
