<template>
  <v-dialog></v-dialog>
</template>
<script setup lang="ts">
import type {tableaux} from '@constl/ipa';

defineEmits<{
  (é: 'sauvegarder', vals: {[idCol: string]: tableaux.élémentBdListeDonnées}): void;
}>();
</script>
