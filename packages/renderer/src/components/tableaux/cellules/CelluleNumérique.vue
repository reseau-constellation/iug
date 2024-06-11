<template>
  <p
    :contenteditable="editer"
    @input="changerValeur"
  >
    {{ valTraduite }}
  </p>
</template>
<script setup lang="ts">
import type { types } from '@constl/ipa';

import {எண்களைப்_பயன்படுத்து, எண்ணிக்கையை_கண்டுப்பிடி} from '@lassi-js/kilimukku-vue';
import { computed } from 'vue';


const props = defineProps<{val: types.élémentsBd; editer: boolean}>();
const émettre = defineEmits<{
  (é: 'changerValeur', val: number): void;
}>();

const எண்ணிக்கை = எண்ணிக்கையை_கண்டுப்பிடி();
const {எண்ணை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();
const valTraduite = எண்ணை_வடிவூட்டு(computed(()=>typeof props.val === 'number' ? props.val : undefined));

const changerValeur = (x: Event) => {
  const texteNuméro = (x.target as HTMLParagraphElement)?.innerText;
  const nouvelleValeur = எண்ணிக்கை.எண்ணுக்கு({உரை: texteNuméro});
  if (nouvelleValeur !== props.val) émettre('changerValeur', nouvelleValeur);
};
</script>
