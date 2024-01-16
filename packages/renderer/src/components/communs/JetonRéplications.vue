<template>
  <v-chip
    class="mb-2 me-2"
    variant="outlined"
    label
  >
    <v-icon start>mdi-pin-outline</v-icon>
    {{ nRéplicationsDispositifsFormatté }}
    {{ t('réplications.réplications', nRéplicationsDispositifs) }}
    <span v-if="nRéplicationsDispositifs > 0">{{
      t('réplications.réplicationsEnLigne', [nRéplicationsEnLigneFormatté])
    }}</span>
  </v-chip>
</template>
<script setup lang="ts">
import {computed} from 'vue';
import {constellation, suivre} from '/@/components/utils';

import {கிளிமூக்கை_பயன்படுத்து, எண்களைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{id: string}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const {எண்ணை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();

// Réplications
const réplications = suivre(constl.réseau.suivreRéplications, {idObjet: props.id, profondeur: 5});
const nRéplicationsDispositifs = computed(() => {
  return réplications.value?.dispositifs.length || 0;
});
const nRéplicationsDispositifsFormatté = எண்ணை_வடிவூட்டு(nRéplicationsDispositifs);

const nRéplicationsEnLigne = computed(() => {
  return réplications.value?.dispositifs.filter(d => !d.vuÀ).length || 0;
});
const nRéplicationsEnLigneFormatté = எண்ணை_வடிவூட்டு(nRéplicationsEnLigne);
</script>
