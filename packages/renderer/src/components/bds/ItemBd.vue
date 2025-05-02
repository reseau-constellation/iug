<template>
  <v-list-item
    :prepend-avatar="srcImgBd || imgDéfaut"
    :subtitle="descrTraduite"
  >
    <template #title>
      <slot>
        <span v-if="noms">{{ nomTraduit || t('bds.sansNom') }}</span>
        <v-skeleton-loader
          v-else
          type="list-item-two-line"
        ></v-skeleton-loader>
      </slot>
    </template>
    <template #subtitle>
      <slot>
        <span v-if="descriptions && descrTraduite">{{ descrTraduite }}</span>
        <v-skeleton-loader
          v-else-if="!descriptions"
          type="list-item-two-line"
        ></v-skeleton-loader>
      </slot>
    </template>
    <série-jetons
      :n-max="3"
      :items="variables"
    >
      <template #jeton="{id: idVariable}">
        <carte-variable :id="idVariable">
          <template #activator="{props: propsActivateur}">
            <JetonVariable
              v-bind="propsActivateur"
              :id="idVariable"
              size="small"
            />
          </template>
        </carte-variable>
      </template>
      <template #itemListe="{id: idVariable}">
        <carte-variable :id="idVariable">
          <template #activator="{props: propsActivateur}">
            <ItemVariable
              v-bind="propsActivateur"
              :id="idVariable"
            />
          </template>
        </carte-variable>
      </template>
      <template #append>
        <lien-objet :id="id"></lien-objet>
      </template>
    </série-jetons>
    <template #append>
      <lien-objet :id="id" />
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed} from 'vue';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import LienObjet from '../communs/LienObjet.vue';
import ItemVariable from '../variables/ItemVariable.vue';
import SérieJetons from '/@/components/communs/SérieJetons.vue';
import {utiliserConstellation} from '/@/components/utils';
import CarteVariable from '/@/components/variables/CarteVariable.vue';
import JetonVariable from '/@/components/variables/JetonVariable.vue';
import {utiliserImagesDéco} from '/@/composables/images';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Nom de la Bd
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = suivre(constl.bds.suivreNomsBd, {idBd: computed(() => props.id)});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Description de la Bd
const descriptions = suivre(constl.bds.suivreDescriptionsBd, {idBd: computed(() => props.id)});
const descrTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);

// Image
const imageBd = suivre(constl.bds.suivreImage, {idBd: computed(() => props.id)});
const srcImgBd = computed(() => {
  if (imageBd.value) {
    return URL.createObjectURL(new Blob([imageBd.value], {type: 'image'}));
  } else {
    return undefined;
  }
});

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('logoBD');

// Variables
const variables = suivre(constl.bds.suivreVariablesBd, {idBd: computed(() => props.id)});
</script>
