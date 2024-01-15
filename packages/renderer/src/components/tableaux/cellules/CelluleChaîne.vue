<template>
  <TexteTronqué
    v-if="texteTraduit"
    :texte="texteTraduit"
    :longueur-max="10"
  />
  <v-skeleton-loader
    v-else
    type="chip"
  />
</template>
<script setup lang="ts">
import {ref} from 'vue';

import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {constellation, enregistrerÉcoute} from '/@/components/utils';

import TexteTronqué from '/@/components/communs/TexteTronqué.vue';

const props = defineProps<{val: string}>();

const constl = constellation();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Texte traduit
const textes = ref<{[langue: string]: string}>({});
enregistrerÉcoute(
  constl.suivreBdDic({
    id: props.val,
    f: x => (textes.value = x as {[langue: string]: string}),
  }),
);
const texteTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(textes);
</script>
