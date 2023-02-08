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
        subtitle="sandra_a88@gmailcom"
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
        prepend-icon="mdi-home"
        :title="$t('navigation.accueil')"
        @click="$router.push({path: '/'})"
      >
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-database"
        :title="$t('navigation.données')"
        @click="$router.push({path: '/données'})"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-pin"
        :title="$t('navigation.favoris')"
        @click="$router.push({path: '/favoris'})"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-magnify"
        :title="$t('navigation.recherche')"
        @click="$router.push({path: '/recherche'})"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-lightning-bolt"
        :title="$t('navigation.automatisations')"
        @click="$router.push({path: '/automatisations'})"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-bug"
        :title="$t('navigation.signalements')"
        @click="$router.push({path: '/signalements'})"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import {inject, ref, computed, onMounted, onUnmounted} from 'vue';
import type ClientConstellation from '@constl/ipa';
import type {schémaFonctionOublier} from '@constl/ipa/dist/src/utils';
import {utiliserImagesDéco} from '/@/composables/images';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
const {useI18n} = கிளிமூக்கை_உபயோகி();
const {$t} = useI18n();

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
let fOublierImageProfil: schémaFonctionOublier | undefined = undefined;
onMounted(async () => {
  fOublierImageProfil = await constl?.profil?.suivreImage({
    f: image => (imageProfil.value = image),
  });
});
onUnmounted(async () => {
  if (fOublierImageProfil) await fOublierImageProfil();
});

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = ref<string>();
obtImageDéco('profil').then(x => (imgDéfaut.value = x));

// Nom d'utilisatrice
const {traduireNom} = utiliserLangues();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

let fOublierNoms: (() => Promise<void>) | undefined = undefined;
onMounted(async () => {
  fOublierNoms = await constl?.profil?.suivreNoms({
    f: x => (noms.value = x),
  });
});
onMounted(async () => {
  if (fOublierNoms) await fOublierNoms();
});

// Liens navigation
</script>
