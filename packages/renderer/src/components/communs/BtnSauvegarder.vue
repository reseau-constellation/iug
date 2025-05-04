<template>
  <v-btn
    variant="text"
    color="primary"
    :disabled="!actif"
    :loading="enAttente"
    append-icon="mdi-check"
  >
    {{ t('communs.sauvegarder') }}
  </v-btn>
</template>
<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

defineProps<{
  actif: boolean;
  enAttente?: boolean;
}>();
</script>
