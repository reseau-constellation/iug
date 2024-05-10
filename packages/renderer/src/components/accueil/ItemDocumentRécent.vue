<template>
  <v-list-item
    :subtitle="texteVuIlYA"
    :prepend-avatar="srcImg || imgDéfaut"
    @click="$router.push(encodeURI(`/données/${typeObjet}/${encodeURIComponent(id)}`))"
  >
    <template #title>
      <span v-if="noms">
        {{ nomTraduit || t(sansNom) }}
        <v-avatar>
          <v-icon>{{ icôneTypeItem }}</v-icon>
        </v-avatar>
      </span>
      <span v-else>
        <v-skeleton-loader type="text" />
      </span>
    </template>
    <template #append>
      <v-btn
        class="mx-2"
        variant="flat"
        icon="mdi-close"
        @click="() => effacerDeLHistorique()"
      />
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import {computed} from 'vue';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {constellation, icôneObjet, suivre} from '../utils';
import {utiliserIlYA} from '../membres/utils';
import {utiliserHistoriqueDocuments} from '/@/état/historiqueDocuments';
import {utiliserImagesDéco} from '/@/composables/images';

const props = defineProps<{id: string; a: number}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();
const {obtImageDéco} = utiliserImagesDéco();

const constl = constellation();

// Solution temporaire pour Constellation qui ne sait pas de quel type est l'objet
const noms = suivre(constl.motsClefs.suivreNomsMotClef, {idMotClef: props.id});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

const historiqueDocuments = utiliserHistoriqueDocuments();

const typeObjet = suivre(constl.suivreTypeObjet, {idObjet: props.id});
const icôneTypeItem = computed(() => {
  const icône = icôneObjet(typeObjet.value);
  return icône || 'mdi-file-document-outline';
});
const sansNom = computed(() => {
  return typeObjet.value ? `${typeObjet.value}s.sansNom` : 'communs.sansNom';
});

// À faire : différencier par type d'objet
const image = suivre(constl.bds.suivreImage, {idBd: props.id});
const srcImg = computed(() => {
  if (image.value) {
    return URL.createObjectURL(new Blob([image.value], {type: 'image'}));
  } else {
    return undefined;
  }
});
const imgDéfaut = obtImageDéco('logoBD');

const {texte: texteVuIlYA} = utiliserIlYA({vuÀ: props.a, t});

const effacerDeLHistorique = () => historiqueDocuments.effacer({id: props.id});
</script>
