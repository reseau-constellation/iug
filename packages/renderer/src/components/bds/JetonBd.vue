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
import {ref, computed} from 'vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {constellation, enregistrerÉcoute} from '/@/components/utils';

const props = defineProps<{id: string}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

// Nom de la Bd
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

enregistrerÉcoute(
  constl.bds.suivreNomsBd({
    idBd: props.id,
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
  constl.bds.suivreImage({
    idBd: props.id,
    f: image => (imageBd.value = image),
  }),
);

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('logoBD');
</script>
