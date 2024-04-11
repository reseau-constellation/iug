<template>
  <v-tooltip
    location="bottom"
    :open-delay="500"
    :disabled="texteTronqué === texte"
  >
    <template #activator="{props: propsActivateur}">
      <span v-bind="propsActivateur">{{ texteTronqué }}</span>
    </template>
    {{ texte }}
  </v-tooltip>
</template>
<script setup lang="ts">
import {computed} from 'vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{texte: string; longueurMax: number}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const texteTronqué = computed(() => {
  if ([...props.texte].length > props.longueurMax) {
    return (
      props.texte.slice(0, Math.max(props.longueurMax - 3, 3)) + t('communs.troisPetitsPoints')
    );
  } else {
    return props.texte;
  }
});

</script>
