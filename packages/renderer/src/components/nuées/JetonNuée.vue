<template>
  <v-chip variant="outlined">
    <v-avatar start>
      <v-img :src="srcImgNuée || imgDéfaut"></v-img>
    </v-avatar>
    {{ nomTraduit || t('nuées.sansNom') }}
  </v-chip>
</template>
<script setup lang="ts">
import {ref, computed} from 'vue';
import {utiliserImagesDéco} from '/@/composables/images';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {enregistrerÉcoute} from '/@/components/utils';
import {constellation} from '/@/components/utils';

const props = defineProps<{id: string}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

// Nom de la nuée
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

enregistrerÉcoute(
  constl.nuées.suivreNomsNuée({
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
  constl.nuées.suivreImage({
    idBd: props.id,
    f: image => (imageNuée.value = image),
  }),
);*/

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('logoBD');
</script>
