<template>
  <v-chip variant="outlined">
    <v-avatar start>
      <v-img :src="srcImgNuée || imgDéfaut"></v-img>
    </v-avatar>
    {{ nomTraduit || t('nuées.sansNom') }}
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
