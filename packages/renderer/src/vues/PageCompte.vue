<template>
  <v-container class="text-center">
    <TitrePage
      :titre="$t('pages.compte.titre')"
      :image="srcImgProfil"
    />
  </v-container>
</template>
<script setup lang="ts">
import {computed, inject, onMounted, onUnmounted, ref} from 'vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import type ClientConstellation from '@constl/ipa';
import type {schémaFonctionOublier} from '@constl/ipa/dist/src/utils';
import TitrePage from '../components/TitrePage.vue';

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {$t} = useI18n();

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
</script>
