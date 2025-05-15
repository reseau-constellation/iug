<template>
  <v-container class="text-center">
    <TitrePage
      :titre="t('pages.favoris.titre')"
      :image="imgFavoris"
      :sous-titre="t('pages.favoris.sousTitre')"
    />
    <v-list class="text-start">
      <p class="text-h6 text-disabled text-center">
        {{ t('pages.favoris.commentAjouterNouveau') }}
      </p>
      <item-favoris
        v-for="fav in mesFavoris"
        :key="fav.idObjet"
        :epingle="fav"
      />
    </v-list>
  </v-container>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '../components/utils';
import TitrePage from '/@/components/communs/TitrePage.vue';
import ItemFavoris from '/@/components/épingles/ItemFavoris.vue';
import {utiliserImagesDéco} from '/@/composables/images';

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {obtImageDéco} = utiliserImagesDéco();

const imgFavoris = obtImageDéco('automatisation');

// Mes favoris
const mesFavoris = suivre(constl.favoris.suivreFavoris);
</script>
