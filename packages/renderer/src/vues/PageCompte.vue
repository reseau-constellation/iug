<template>
  <v-container class="text-center">
    <TitrePage :titre="$t('pages.compte.titre')" />
    <ImageEditable
      :src-image="srcImgProfil"
      :img-defaut="imgDéfaut"
      :taille-avatar="mdAndUp ? 275 : 175"
      :editable="true"
      :max-taille-image="MAX_TAILLE_IMAGE"
      @image-changee="image => sauvegarderImage(image)"
    />
    <h1>
      <span :class="{'text-disabled': !nomTraduit}">{{ nomTraduit || $t('communs.anonyme') }}</span>
      <DialogueNoms
        :indice-nom="$t('listeNomsProfil.indiceNom')"
        :indice-langue="$t('listeNomsProfil.indiceLangue')"
        :texte-aucun-nom="$t('listeNomsProfil.texteAucunNom')"
        :noms-initiaux="noms"
        :titre="$t('pages.compte.titreDialogueNoms')"
        :sous-titre="$t('pages.compte.sousTitreDialogueNoms')"
        @ajuster-noms="nms => ajusterNoms(nms)"
      >
        <template #activator="{props}">
          <v-btn
            v-bind="props"
            icon="mdi-pencil"
            variant="flat"
          ></v-btn>
        </template>
      </DialogueNoms>
    </h1>
  </v-container>
</template>
<script setup lang="ts">
import {computed, inject, onMounted, onUnmounted, ref} from 'vue';
import {useDisplay} from 'vuetify';
import {utiliserImagesDéco} from '/@/composables/images';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import type ClientConstellation from '@constl/ipa';
import type {schémaFonctionOublier} from '@constl/ipa/dist/src/utils';

import TitrePage from '../components/communs/TitrePage.vue';
import ImageEditable from '/@/components/communs/ImageEditable.vue';
import {MAX_TAILLE_IMAGE} from '/@/consts';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import DialogueNoms from '../components/communs/listeNoms/DialogueNoms.vue';

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {$t} = useI18n();
const {mdAndUp} = useDisplay();

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
const imgDéfaut = obtImageDéco('profil');

const sauvegarderImage = async (image?: ArrayBuffer) => {
  if (image) {
    console.log('ici', {image});
    await constl?.profil?.sauvegarderImage({image});
  } else {
    console.log('là', {image});
    await constl?.profil?.effacerImage();
  }
};

// Nom profil
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

const ajusterNoms = async (nms: {[langue: string]: string}) => {
  const àEffacer = Object.keys(noms.value).filter(lng => !nms[lng]);
  for (const [langue, nom] of Object.entries(nms)) {
    await constl?.profil?.sauvegarderNom({langue, nom});
  }
  for (const langue of àEffacer) {
    await constl?.profil?.effacerNom({langue});
  }
};
</script>
