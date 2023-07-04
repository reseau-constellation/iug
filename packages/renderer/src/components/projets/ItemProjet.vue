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
import type {client} from '@constl/ipa';
import {ref, inject, computed} from 'vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {enregistrerÉcoute} from '/@/components/utils';

const props = defineProps<{id: string}>();

const constl = inject<client.ClientConstellation>('constl');

// Nom du projet
const {traduireNom} = utiliserLangues();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

enregistrerÉcoute(
  constl?.projets?.suivreNomsProjet({
    id: props.id,
    f: x => (noms.value = x),
  }),
);

// Description du projet
const descriptions = ref<{[lng: string]: string}>({});
const descrTraduite = traduireNom(descriptions);

enregistrerÉcoute(
  constl?.projets?.suivreDescrProjet({
    id: props.id,
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
  constl?.projets?.suivreImage({
    idProjet: props.id,
    f: image => (imageProjet.value = image),
  }),
);

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('logoBD');
</script>
