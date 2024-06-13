<template>
  <TexteTronqué
    v-if="texteTraduit"
    :texte="texteTraduit"
    :longueur-max="30"
  />
  <v-skeleton-loader
    v-else-if="valValide"
    type="text"
  />
</template>
<script setup lang="ts">
import type { types } from '@constl/ipa';
import {type ComputedRef, computed} from 'vue';

import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {adresseOrbiteValide, constellation, suivre} from '/@/components/utils';

import TexteTronqué from '/@/components/communs/TexteTronqué.vue';

const props = defineProps<{val?: types.élémentsBd}>();

const constl = constellation();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const valValide = computed(()=>{
  if (typeof props.val === 'string' && adresseOrbiteValide(props.val)) return props.val;
  else return undefined;
});

// Texte traduit
const textes: ComputedRef<{[langue: string]: string}> = suivre(constl.suivreBdDic, {id: valValide});
const texteTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(textes);
</script>
