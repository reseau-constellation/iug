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
    >
      {{ t('réplications.réplicationsEnLigne', [nRéplicationsEnLigne]) }}
    </span>
  </v-chip>
</template>
<script setup lang="ts">
import {rechercher, suivre} from '@constl/vue';
import {computed} from 'vue';

import {utiliserConstellation} from '/@/components/utils';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

// Réplications
const {résultats: réplications} = rechercher(constl.réseau.suivreRéplications, {
  idObjet: computed(() => props.id),
  profondeur: 5,
});
const nRéplicationsDispositifs = computed(() => {
  return réplications.value?.dispositifs.length || 0;
});

const nRéplicationsEnLigne = computed(() => {
  return réplications.value?.dispositifs.filter(d => !d.dispositif.vuÀ).length || 0;
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
