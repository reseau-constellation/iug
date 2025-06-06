<template>
  <v-navigation-drawer
    expand-on-hover
    permanent
    rail
  >
    <v-list>
      <v-list-item
        :title="nomTraduit"
        @click="$router.push({path: '/compte'})"
      >
        <template #prepend>
          <image-profil />
        </template>
        <template #subtitle>
          <v-icon start>{{ icôneDispositif }}</v-icon>
          <TexteTronque
            :texte="nomDispositif || t('dispositifs.sansNom')"
            :longueur-max="20"
          />
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list
      density="compact"
      class="align-start"
      nav
    >
      <v-list-item
        v-for="lien in liens"
        :key="lien.chemin"
        :prepend-icon="lien.icône"
        :title="t(lien.texte)"
        @click="$router.push(encodeURI(lien.chemin))"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed, onMounted, ref} from 'vue';

import {மொழிகளைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import {utiliserConstellation} from '/@/components/utils';

import ImageProfil from './communs/ImageProfil.vue';
import TexteTronque from './communs/TexteTronqué.vue';
import {obtIcôneDispositifDeType, utiliserNomEtTypeDispositif} from './membres/utils';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const constl = utiliserConstellation();

// Nom d'utilisatrice
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = suivre(constl.profil.suivreNoms, {});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Dispositif
const idDispositif = ref<string>();
onMounted(async () => {
  idDispositif.value = await constl.obtIdDispositif();
});
const {nomDispositif, typeDispositif} = utiliserNomEtTypeDispositif({
  idDispositif: idDispositif,
});
const icôneDispositif = computed(() => obtIcôneDispositifDeType(typeDispositif.value));

// Liens navigation
const liens: {icône: string; chemin: string; texte: string}[] = [
  {
    icône: 'mdi-home',
    texte: 'navigation.accueil',
    chemin: '/',
  },

  {
    icône: 'mdi-database',
    texte: 'navigation.données',
    chemin: '/données',
  },

  {
    icône: 'mdi-pin',
    texte: 'navigation.favoris',
    chemin: '/favoris',
  },

  {
    icône: 'mdi-magnify',
    texte: 'navigation.recherche',
    chemin: '/recherche',
  },

  {
    icône: 'mdi-lightning-bolt',
    texte: 'navigation.automatisations',
    chemin: '/automatisations',
  },

  {
    icône: 'mdi-bug',
    texte: 'navigation.signalements',
    chemin: '/signalements',
  },
];
</script>
