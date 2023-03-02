<template>
  <v-list-item
    v-show="visible"
    class="text-start"
    :prepend-avatar="srcImgProfil || imgDéfaut"
    density="compact"
  >
    <template #title>
      {{ nomTraduit || t('communs.anonyme') }}
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa';
import {ref, inject, computed} from 'vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {enregistrerÉcoute} from '/@/composables/utils';

const props = defineProps<{compte: string; montrerAnonymes: boolean}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Nom d'utilisatrice
const {traduireNom} = utiliserLangues();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

enregistrerÉcoute(
  constl?.profil?.suivreNoms({
    idCompte: props.compte,
    f: x => (noms.value = x),
  }),
);

// Visibilité
const visible = computed(() => {
  return props.montrerAnonymes || nomTraduit.value;
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
enregistrerÉcoute(
  constl?.profil?.suivreImage({
    idCompte: props.compte,
    f: image => (imageProfil.value = image),
  }),
);

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('profil');
</script>
