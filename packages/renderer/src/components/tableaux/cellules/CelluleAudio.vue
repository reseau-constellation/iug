<template>
  <cellule-fichier
    :editable="editable"
    :val="val"
    icone="mdi-waveform"
    accepter="audio/*"
    @modifiee="({val}) => émettre('modifiee', {val})"
  />
</template>
<script setup lang="ts">
import type { types } from '@constl/ipa';

import CelluleFichier from './CelluleFichier.vue';

defineProps<{val?: types.élémentsBd, editable: boolean}>();
const émettre = defineEmits<{(é: 'modifiee', args: {val?: File}): void;}>();

</script>
