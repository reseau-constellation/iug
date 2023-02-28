<template>
  <v-list-item>
    <template #prepend>
      <v-icon>{{ spécification.type === 'exportation' ? 'mdi-export' : 'mdi-import' }}</v-icon>
    </template>
    <v-list-item-title>
      <v-icon>icôneTypeObjet</v-icon>
    </v-list-item-title>
    <v-chip>
      <v-icon></v-icon>
      {{ texteJetonÉtat }}
    </v-chip>
  </v-list-item>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';
import {computed, ref, onMounted, onUnmounted} from 'vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const props = defineProps<{
  spécification: automatisation.SpécificationAutomatisation;
  état: automatisation.ÉtatAutomatisation;
}>();

// Chronomètre
const maintenant = ref(new Date().getTime());
let oublierChronomètre: number | undefined;
onMounted(() => {
  oublierChronomètre = window.setInterval(() => (maintenant.value = new Date().getTime()), 1000);
});
onUnmounted(() => {
  if (oublierChronomètre) clearInterval(oublierChronomètre);
});

// État automatisation
const texteJetonÉtat = computed(() => {
  switch (props.état.type) {
    case 'écoute':
      return t('auto.jetonÉtat.écoute');
    case 'sync':
      return t('auto.jetonÉtat.sync');
    case 'programmée':
      return t('auto.jetonÉtat.programmée', {dans: props.état.à - maintenant.value});
    case 'erreur':
      if (props.état.prochaineProgramméeÀ) {
        return t('auto.jetonÉtat.erreurRéssayer', {
          dans: props.état.prochaineProgramméeÀ - maintenant.value,
        });
      } else {
        return t('auto.jetonÉtat.erreur');
      }
    default:
      throw new Error(props.état);
  }
});
</script>
