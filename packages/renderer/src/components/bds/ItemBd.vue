<template>
  <v-list-item
    :prepend-avatar="srcImgBd || imgDéfaut"
    :title="nomTraduit || t('bds.sansNom')"
    :subtitle="descrTraduite"
  >
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
  </v-list-item>
</template>
<script setup lang="ts">
import {computed} from 'vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {constellation, suivre} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import JetonVariable from '/@/components/variables/JetonVariable.vue';
import SérieJetons from '/@/components/communs/SérieJetons.vue';
import CarteVariable from '/@/components/variables/CarteVariable.vue';
import ItemVariable from '../variables/ItemVariable.vue';
import LienObjet from '../communs/LienObjet.vue';

const props = defineProps<{id: string}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Nom de la Bd
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = suivre(constl.bds.suivreNomsBd, {idBd: props.id}, {});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Description de la Bd
const descriptions = suivre(constl.bds.suivreDescriptionsBd, {idBd: props.id}, {});
const descrTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);

// Image
const imageBd = suivre(constl.bds.suivreImage, {idBd: props.id});
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
const variables = suivre(constl.bds.suivreVariablesBd, {idBd: props.id});
</script>
