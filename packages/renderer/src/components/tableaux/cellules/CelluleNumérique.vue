<template>
  <p
    :contenteditable="editer"
    @input="changerValeur"
  >
    {{ val }}
  </p>
</template>
<script setup lang="ts">
import type {எண்ணிக்கை} from 'ennikkai';
import {inject} from 'vue';

const props = defineProps<{val: number; editer: boolean}>();
const émettre = defineEmits<{
  (é: 'changerValeur', val: number): void;
}>();

const {எண்ணிக்கை: ennikkai} = inject<{
  எண்ணிக்கை: எண்ணிக்கை;
}>('locales')!;

const changerValeur = (x: Event) => {
  const texteNuméro = (x.target as HTMLParagraphElement)?.innerText;
  const nouvelleValeur = ennikkai.எண்ணுக்கு({உரை: texteNuméro});
  if (nouvelleValeur !== props.val) émettre('changerValeur', nouvelleValeur);
};
</script>
