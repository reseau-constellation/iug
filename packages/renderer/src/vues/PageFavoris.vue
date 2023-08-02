<template>
  <v-container class="text-center">
    <TitrePage
      :titre="t('pages.favoris.titre')"
      :image="imgFavoris"
      :sous-titre="t('pages.favoris.sousTitre')"
    />
    <v-list>
      <v-list-item
        prepend-icon="mdi-plus"
        :title="t('pages.favoris.commentAjouterNouveau.titre')"
        :subtitle="t('pages.favoris.commentAjouterNouveau.sousTitre')"
        @click="$router.push('/données/')"
      />
      <ItemFavoris
        v-for="fav in mesFavoris"
        :key="fav.idObjet"
        :epingle="fav"
      />
    </v-list>
  </v-container>
</template>
<script setup lang="ts">
import type {favoris, client} from '@constl/ipa';
import {inject, ref} from 'vue';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import TitrePage from '/@/components/communs/TitrePage.vue';
import {utiliserImagesDéco} from '/@/composables/images';
import ItemFavoris from '/@/components/épingles/ItemFavoris.vue';
import {enregistrerÉcoute} from '../components/utils';

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {obtImageDéco} = utiliserImagesDéco();

const imgFavoris = obtImageDéco('automatisation');

// Mes favoris
const mesFavoris = ref<favoris.ÉlémentFavorisAvecObjet[]>();
enregistrerÉcoute(
  constl?.favoris?.suivreFavoris({
    f: x => (mesFavoris.value = x),
  }),
);
</script>
