<template>
  <v-list-item
    :prepend-avatar="srcImgProjet || imgDéfaut"
    :title="nomTraduit"
    :subtitle="descrTraduite"
  >
    <slot></slot>
  </v-list-item>
</template>
<script setup lang="ts">
import type {ClientConstellation} from '@constl/ipa';

import {ref, inject, computed} from 'vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {enregistrerÉcoute} from '/@/components/utils';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

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

// Description du projet
const descriptions = ref<{[lng: string]: string}>({});
const descrTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);

enregistrerÉcoute(
  constl?.projets.suivreDescriptionsProjet({
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
