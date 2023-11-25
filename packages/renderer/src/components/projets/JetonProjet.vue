<template>
  <v-chip variant="outlined">
    <v-avatar start>
      <v-img :src="srcImgProjet || imgDéfaut"></v-img>
    </v-avatar>
    {{ nomTraduit || t('projets.sansNom') }}
  </v-chip>
</template>
<script setup lang="ts">
import type {ClientConstellation} from '@constl/ipa';

import {ref, inject, computed} from 'vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {enregistrerÉcoute} from '/@/components/utils';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

// Nom du projet
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

enregistrerÉcoute(
  constl?.projets.suivreNomsProjet({
    idProjet: props.id,
    f: x => (noms.value = x),
  }),
);

// Image
const imageProjet = ref<Uint8Array | null>();
const srcImgProjet = computed(() => {
  if (imageProjet.value) {
    return URL.createObjectURL(new Blob([imageProjet.value], {type: 'image'}));
  } else {
    return undefined;
  }
});
enregistrerÉcoute(
  constl?.projets.suivreImage({
    idProjet: props.id,
    f: image => (imageProjet.value = image),
  }),
);

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('logoBD');
</script>
