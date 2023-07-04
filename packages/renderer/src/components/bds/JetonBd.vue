<template>
  <v-chip
    variant="outlined"
    class="me-2 mb-2"
  >
    <v-avatar start>
      <v-img :src="srcImgBd || imgDéfaut"></v-img>
    </v-avatar>
    {{ nomTraduit || t('bds.sansNom') }}
  </v-chip>
</template>
<script setup lang="ts">
import type {client} from '@constl/ipa';
import {ref, inject, computed} from 'vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {enregistrerÉcoute} from '/@/components/utils';

const props = defineProps<{id: string}>();

const constl = inject<client.ClientConstellation>('constl');

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
