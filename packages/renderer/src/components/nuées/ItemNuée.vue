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
import {ref, computed} from 'vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {constellation, enregistrerÉcoute} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import LienObjet from '../communs/LienObjet.vue';

const props = defineProps<{id: string}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Nom de la nuée

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

enregistrerÉcoute(
  constl.nuées.suivreNomsNuée({
    idNuée: props.id,
    f: x => (noms.value = x),
  }),
);

// Description de la nuée
const descriptions = ref<{[lng: string]: string}>({});
const descrTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);

enregistrerÉcoute(
  constl.nuées.suivreDescriptionsNuée({
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
  constl.nuées.suivreImage({
    idBd: props.id,
    f: image => (imageNuée.value = image),
  }),
);*/

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('logoBD');
</script>
