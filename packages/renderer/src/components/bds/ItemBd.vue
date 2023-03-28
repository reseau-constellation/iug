<template>
  <v-list-item
    :prepend-avatar="srcImgBd || imgDéfaut"
    :title="nomTraduit || t('bds.sansNom')"
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
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Nom de la Bd
const {traduireNom} = utiliserLangues();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

enregistrerÉcoute(
  constl?.bds?.suivreNomsBd({
    id: props.id,
    f: x => (noms.value = x),
  }),
);

// Description de la Bd
const descriptions = ref<{[lng: string]: string}>({});
const descrTraduite = traduireNom(descriptions);

enregistrerÉcoute(
  constl?.bds?.suivreDescrBd({
    id: props.id,
    f: x => (noms.value = x),
  }),
);

// Image
const imageBd = ref<Uint8Array | null>();
const srcImgBd = computed(() => {
  if (imageBd.value) {
    return URL.createObjectURL(new Blob([imageBd.value], {type: 'image'}));
  } else {
    return undefined;
  }
});
enregistrerÉcoute(
  constl?.bds?.suivreImage({
    idBd: props.id,
    f: image => (imageBd.value = image),
  }),
);

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('logoBD');
</script>
