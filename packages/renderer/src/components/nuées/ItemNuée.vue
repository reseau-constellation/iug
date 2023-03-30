<template>
  <v-list-item
    :prepend-avatar="srcImgNuée || imgDéfaut"
    :title="nomTraduit"
    :subtitle="descrTraduite"
  >
  </v-list-item>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa';
import {ref, inject, computed} from 'vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {enregistrerÉcoute} from '/@/composables/utils';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

// Nom de la nuée
const {traduireNom} = utiliserLangues();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

enregistrerÉcoute(
  constl?.nuées?.suivreNomsNuée({
    idNuée: props.id,
    f: x => (noms.value = x),
  }),
);

// Description de la nuée
const descriptions = ref<{[lng: string]: string}>({});
const descrTraduite = traduireNom(descriptions);

enregistrerÉcoute(
  constl?.nuées?.suivreDescriptionsNuée({
    idNuée: props.id,
    f: x => (noms.value = x),
  }),
);

// Image
const imageNuée = ref<Uint8Array | null>();
const srcImgNuée = computed(() => {
  if (imageNuée.value) {
    return URL.createObjectURL(new Blob([imageNuée.value], {type: 'image'}));
  } else {
    return undefined;
  }
});
/*enregistrerÉcoute(
  constl?.nuées?.suivreImage({
    idBd: props.id,
    f: image => (imageNuée.value = image),
  }),
);*/

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('logoBD');
</script>
