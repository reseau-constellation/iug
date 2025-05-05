<template>
  <v-list-item
    :prepend-avatar="srcImgProjet || imgDéfaut"
    :title="nomTraduit"
    :subtitle="descrTraduite"
  >
    <série-jetons
      :n-max="3"
      :items="bds"
    >
      <template #jeton="{id: idVariable}">
        <carte-bd :id="idVariable">
          <template #activateur="{props: propsActivateur}">
            <jeton-bd
              v-bind="propsActivateur"
              :id="idVariable"
              size="small"
            />
          </template>
        </carte-bd>
      </template>
      <template #itemListe="{id: idVariable}">
        <carte-bd :id="idVariable">
          <template #activateur="{props: propsActivateur}">
            <item-bd
              v-bind="propsActivateur"
              :id="idVariable"
            />
          </template>
        </carte-bd>
      </template>
    </série-jetons>

    <slot></slot>
  </v-list-item>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed} from 'vue';

import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import CarteBd from '/@/components/bds/CarteBd.vue';
import ItemBd from '/@/components/bds/ItemBd.vue';
import JetonBd from '/@/components/bds/JetonBd.vue';
import SérieJetons from '/@/components/communs/SérieJetons.vue';
import {utiliserConstellation} from '/@/components/utils';
import {utiliserImagesDéco} from '/@/composables/images';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

// Nom du projet
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = suivre(constl.projets.suivreNomsProjet, {idProjet: computed(() => props.id)});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Description du projet
const descriptions = suivre(constl.projets.suivreDescriptionsProjet, {
  idProjet: computed(() => props.id),
});
const descrTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);

// Image
const imageProjet = suivre(constl.projets.suivreImage, {idProjet: computed(() => props.id)});
const srcImgProjet = computed(() => {
  if (imageProjet.value) {
    return URL.createObjectURL(new Blob([imageProjet.value], {type: 'image'}));
  } else {
    return undefined;
  }
});

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('logoBD');

// Bds
const bds = suivre(constl.projets.suivreBdsProjet, {idProjet: computed(() => props.id)});
</script>
