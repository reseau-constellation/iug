<template>
  <v-chip variant="outlined">
    <v-avatar start>
      <v-img :src="srcImgProjet || imgDéfaut"></v-img>
    </v-avatar>
    {{ nomTraduit || t('projets.sansNom') }}
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
