<template>
  <v-chip
    label
    density="compact"
    variant="outlined"
  >
    <template #prepend>
      <v-progress-circular
        v-if="statut.type === 'sync'"
        indeterminate
      >
        <v-icon :color="icôneStatut.couleur">{{ icôneStatut.icône }}</v-icon>
      </v-progress-circular>
      <v-icon
        v-else
        start
        :color="icôneStatut.couleur"
      >
        {{ icôneStatut.icône }}
      </v-icon>
    </template>
    {{ t(texteStatut) }}
  </v-chip>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, onMounted, onUnmounted, ref} from 'vue';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const props = defineProps<{
  statut: automatisation.ÉtatAutomatisation;
}>();

// Icône
const icôneStatut = computed(() => {
  switch (props.statut.type) {
    case 'erreur':
      return {icône: 'mdi-alert', couleur: 'error'};
    case 'programmée':
      return {icône: 'mdi-check', couleur: 'success'};
    case 'sync':
      return {icône: 'mdi-sync', couleur: 'primary'};
    case 'écoute':
      return {icône: '', couleur: 'success'};
    default:
      throw new Error(JSON.stringify(props.statut));
  }
});

// Chronomètre
const maintenant = ref(new Date().getTime());
let oublierChronomètre: number | undefined;
onMounted(() => {
  oublierChronomètre = window.setInterval(() => (maintenant.value = new Date().getTime()), 1000);
});
onUnmounted(() => {
  if (oublierChronomètre) clearInterval(oublierChronomètre);
});

// Statut automatisation
const texteStatut = computed(() => {
  switch (props.statut.type) {
    case 'écoute':
      return 'automatisations.jetonStatut.écoute';
    case 'sync':
      return t('automatisations.jetonStatut.sync', {
        depuis: maintenant.value - props.statut.depuis,
      });
    case 'programmée':
      return t('automatisations.jetonStatut.programmée', {dans: props.statut.à - maintenant.value});
    case 'erreur':
      if (props.statut.prochaineProgramméeÀ) {
        return t('automatisations.jetonStatut.erreurRéssayer', {
          dans: props.statut.prochaineProgramméeÀ - maintenant.value,
        });
      } else {
        return 'automatisations.jetonStatut.erreur';
      }
    default:
      throw new Error(props.statut);
  }
});
</script>
