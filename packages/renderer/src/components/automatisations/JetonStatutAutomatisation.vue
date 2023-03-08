<template>
  <v-chip>
    <template #prepend>
      <v-progress-circular
        v-if="statut.type === 'sync'"
        indeterminate
      >
        <v-icon :color="icôneStatut.couleur">{{ icôneStatut.icône }}</v-icon>
      </v-progress-circular>
      <v-icon
        v-else
        :color="icôneStatut.couleur"
      >
        {{ icôneStatut.icône }}
      </v-icon>
    </template>
    {{ texteStatut }}
  </v-chip>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';

import {computed, ref, onMounted, onUnmounted} from 'vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

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
      return t('auto.jetonStatut.écoute');
    case 'sync':
      return t('auto.jetonStatut.sync', {depuis: maintenant.value - props.statut.depuis});
    case 'programmée':
      return t('auto.jetonStatut.programmée', {dans: props.statut.à - maintenant.value});
    case 'erreur':
      if (props.statut.prochaineProgramméeÀ) {
        return t('auto.jetonStatut.erreurRéssayer', {
          dans: props.statut.prochaineProgramméeÀ - maintenant.value,
        });
      } else {
        return t('auto.jetonStatut.erreur');
      }
    default:
      throw new Error(props.statut);
  }
});
</script>
