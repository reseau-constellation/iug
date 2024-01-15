<template>
  <v-avatar
    :image="srcImgProfil || imgDéfaut"
    v-bind="props"
  />
</template>
<script setup lang="ts">
import {computed, ref} from 'vue';

import {utiliserImagesDéco} from '/@/composables/images';
import {constellation, enregistrerÉcoute} from '/@/components/utils';

const props = defineProps<{id?: string}>();

const constl = constellation();

const imageProfil = ref<Uint8Array | null>();
const srcImgProfil = computed(() => {
  if (imageProfil.value) {
    return URL.createObjectURL(new Blob([imageProfil.value], {type: 'image'}));
  } else {
    return undefined;
  }
});
enregistrerÉcoute(
  constl.profil.suivreImage({
    idCompte: props.id,
    f: image => (imageProfil.value = image),
  }),
);

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('profil');
</script>
