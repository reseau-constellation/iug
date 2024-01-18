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
import {type ComputedRef} from 'vue';

import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {constellation, suivre} from '/@/components/utils';

import TexteTronqué from '/@/components/communs/TexteTronqué.vue';

const props = defineProps<{val: string}>();

const constl = constellation();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Texte traduit
const textes: ComputedRef<{[langue: string]: string}> = suivre(
  constl.suivreBdDic,
  {id: props.val},
  {},
);
const texteTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(textes);
</script>
