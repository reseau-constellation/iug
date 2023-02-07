<template>
  <v-chip variant="flat">
    <v-avatar start>
      <v-img :src="srcImgProfil || imgDéfaut"></v-img>
    </v-avatar>
    {{ nomTraduit || $t('communs.anonyme') }}
  </v-chip>
</template>

<script setup lang="ts">
import type ClientConstellation from '@constl/ipa';
import type {schémaFonctionOublier} from '@constl/ipa/dist/src/utils';
import {ref, inject, onMounted, computed, onUnmounted} from 'vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';

const props = defineProps<{compte: string}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {$t} = useI18n();

// Nom d'utilisatrice
const {traduireNom} = utiliserLangues();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

let fOublierNoms: (() => Promise<void>) | undefined = undefined;
onMounted(async () => {
  fOublierNoms = await constl?.profil?.suivreNoms({
    idCompte: props.compte,
    f: x => (noms.value = x),
  });
});
onMounted(async () => {
  if (fOublierNoms) await fOublierNoms();
});

// Image
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
    idCompte: props.compte,
    f: image => (imageProfil.value = image),
  });
});
onUnmounted(async () => {
  if (fOublierImageProfil) await fOublierImageProfil();
});

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = ref<string>();
obtImageDéco('profil').then(x => (imgDéfaut.value = x));
</script>
