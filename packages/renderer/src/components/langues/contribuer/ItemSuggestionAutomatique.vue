<template>
  <v-list-item
    lines="three"
    @click="utiliser"
  >
    <v-list-item-subtitle>
      {{ clef }}
    </v-list-item-subtitle>
    <v-divider class="my-2" />
    <texte-surligne-recherche
      :info="{type: 'texte', texte, début: corresp.début, fin: corresp.fin}"
    />
    <v-divider class="my-2" />
    {{ traduc }}
  </v-list-item>
</template>
<script setup lang="ts">
import TexteSurligneRecherche from '../../recherche/TexteSurlignéRecherche.vue';

defineProps<{clef: string; texte: string; traduc: string; corresp: {début: number; fin: number}}>();
const émettre = defineEmits<{
  (e: 'utiliser'): void;
}>();

// Actions
const utiliser = () => {
  émettre('utiliser');
};
</script>
