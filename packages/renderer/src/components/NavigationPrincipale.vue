<template>
  <v-navigation-drawer
    expand-on-hover
    permanent
    rail
  >
    <v-list>
      <v-list-item
        :prepend-avatar="srcImgProfil || imgDéfaut"
        :title="nomTraduit"
        :subtitle="idDispositif"
        @click="$router.push({path: '/compte'})"
      ></v-list-item>
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
        :title="lien.texte"
        @click="$router.push(encodeURI(lien.chemin))"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import {inject, ref, computed, onMounted} from 'vue';
import type ClientConstellation from '@constl/ipa';
import {utiliserImagesDéco} from '/@/composables/images';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {enregistrerÉcoute} from '/@/composables/utils';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const constl = inject<ClientConstellation>('constl');

// Image profil
const imageProfil = ref<Uint8Array | null>();
const srcImgProfil = computed(() => {
  if (imageProfil.value) {
    return URL.createObjectURL(new Blob([imageProfil.value], {type: 'image'}));
  } else {
    return undefined;
  }
});
enregistrerÉcoute(
  constl?.profil?.suivreImage({
    f: image => (imageProfil.value = image),
  }),
);

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('profil');

// Nom d'utilisatrice
const {traduireNom} = utiliserLangues();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

enregistrerÉcoute(
  constl?.profil?.suivreNoms({
    f: x => (noms.value = x),
  }),
);

// Dispositif
const idDispositif = ref<string>();
onMounted(async () => {
  idDispositif.value = await constl?.obtIdOrbite();
});

// Liens navigation
const liens: {icône: string; chemin: string; texte: string}[] = [
  {
    icône: 'mdi-home',
    texte: t('navigation.accueil'),
    chemin: '/',
  },

  {
    icône: 'mdi-database',
    texte: t('navigation.données'),
    chemin: '/données',
  },

  {
    icône: 'mdi-pin',
    texte: t('navigation.favoris'),
    chemin: '/favoris',
  },

  {
    icône: 'mdi-magnify',
    texte: t('navigation.recherche'),
    chemin: '/recherche',
  },

  {
    icône: 'mdi-lightning-bolt',
    texte: t('navigation.automatisations'),
    chemin: '/automatisations',
  },

  {
    icône: 'mdi-bug',
    texte: t('navigation.signalements'),
    chemin: '/signalements',
  },
];
</script>
