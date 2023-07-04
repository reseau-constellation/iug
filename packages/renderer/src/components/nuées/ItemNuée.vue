<template>
  <v-list-item
    :prepend-avatar="srcImgNuée || imgDéfaut"
    :title="nomTraduit || t('nuées.sansNom')"
    :subtitle="descrTraduite || t('communs.baseCarteObjet.sansDescription')"
  >
    <template #append>
      <lien-objet :id="id"></lien-objet>
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import type {client} from '@constl/ipa';
import {ref, inject, computed} from 'vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {enregistrerÉcoute} from '/@/components/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import LienObjet from '../communs/LienObjet.vue';

const props = defineProps<{id: string}>();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {traduireNom} = utiliserLangues();

// Nom de la nuée

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
    f: x => (descriptions.value = x),
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
