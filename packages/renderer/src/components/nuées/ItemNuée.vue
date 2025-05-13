<template>
  <v-list-item
    :title="nomTraduit || t('nuées.sansNom')"
    :subtitle="descrTraduite || t('communs.baseCarteObjet.sansDescription')"
  >
    <template #prepend>
      <v-img
        :src="srcImgNuée || imgDéfaut"
        class="me-4 rounded-circle border-thin"
        width="40"
        height="40"
      />
    </template>
    <template #append>
      <lien-objet :id="id"></lien-objet>
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {மொழிகளைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import LienObjet from '../communs/LienObjet.vue';
import {utiliserConstellation} from '/@/components/utils';
import {utiliserImagesDéco} from '/@/composables/images';
import { sourceImage } from '/@/utils';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Nom de la nuée

const noms = suivre(constl.nuées.suivreNomsNuée, {idNuée: computed(() => props.id)});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Description de la nuée
const descriptions = suivre(constl.nuées.suivreDescriptionsNuée, {
  idNuée: computed(() => props.id),
});
const descrTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);

// Image
const imageNuée = suivre(constl.nuées.suivreImage, {idNuée: computed(() => props.id)});
const srcImgNuée = sourceImage(imageNuée);

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('logoBD');
</script>
