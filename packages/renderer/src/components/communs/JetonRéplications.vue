<template>
  <v-chip
    variant="outlined"
    label
  >
    <v-icon start>{{ icône }}</v-icon>
    {{ t('réplications.réplications', {n: nRéplicationsDispositifs}, nRéplicationsDispositifs) }}
    <span
      v-if="nRéplicationsDispositifs > 0"
      class="ms-2"
      >{{ t('réplications.réplicationsEnLigne', [nRéplicationsEnLigne]) }}</span
    >
  </v-chip>
</template>
<script setup lang="ts">
import {computed} from 'vue';
import {constellation, suivre} from '/@/components/utils';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{id: string}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Réplications
const réplications = suivre(constl.réseau.suivreRéplications, {idObjet: props.id, profondeur: 5});
const nRéplicationsDispositifs = computed(() => {
  return réplications.value?.dispositifs.length || 0;
});

const nRéplicationsEnLigne = computed(() => {
  return réplications.value?.dispositifs.filter(d => !d.vuÀ).length || 0;
});

const monCompte = suivre(constl.suivreIdCompte);
const répliquéParMoi = computed(
  () => !!réplications.value?.membres.find(m => m.infoMembre.idCompte === monCompte.value),
);

// Icône
const icône = computed(() => {
  return répliquéParMoi.value ? 'mdi-pin' : 'mdi-pin-outline';
});
</script>
