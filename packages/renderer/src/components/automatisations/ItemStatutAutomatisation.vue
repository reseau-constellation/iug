<template>
  <v-list-item title="Ce dispositif">
    <template #prepend>
      <v-icon
        start
        :color="icôneStatut.couleur"
      >
        {{ icôneStatut.icône }}
      </v-icon>
    </template>
    <template #subtitle>
      {{ t(texteStatut) }}
    </template>
    <jeton-fichier-exportation
      v-if="spécification?.type === 'exportation'"
      class="my-2"
      :spécification="spécification"
      @click="() => changerFichierExportation()"
    />
    <v-btn
      class="my-2"
      size="small"
      variant="outlined"
      append-icon="mdi-refresh"
      @click="relancer"
    >
      "Relancer"
    </v-btn>
  </v-list-item>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {utiliserConstellation} from '../utils';
import JetonFichierExportation from './JetonFichierExportation.vue';
// import { choisirFichierSauvegarde } from '/@/utils';
import {utiliserDans} from './utils';

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const dans = utiliserDans({t});

const props = defineProps<{
  statut: automatisation.ÉtatAutomatisation;
  spécification: automatisation.SpécificationAutomatisation;
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

// Fichier
// const fichierExportation = ref(props.spécification);
const changerFichierExportation = async () => {
  // const fichier = await choisirFichierSauvegarde();
  // if (fichier) fichierExportation.value = fichier;
};

// Statut automatisation
const programméeDans = dans(
  computed(() =>
    props.statut.type === 'programmée'
      ? props.statut.à
      : props.statut.type === 'erreur'
        ? props.statut.prochaineProgramméeÀ
        : undefined,
  ),
);
const enCoursDepuis = dans(
  computed(() => (props.statut.type === 'sync' ? props.statut.depuis : undefined)),
);
const texteStatut = computed(() => {
  switch (props.statut.type) {
    case 'écoute':
      return 'automatisations.jetonStatut.écoute';
    case 'sync':
      return t('automatisations.jetonStatut.sync', {depuis: enCoursDepuis.value});
    case 'programmée':
      return t('automatisations.jetonStatut.programmée', {dans: programméeDans.value});
    case 'erreur':
      if (props.statut.prochaineProgramméeÀ) {
        return t('automatisations.jetonStatut.erreurRéssayer', {
          dans: programméeDans.value,
        });
      } else {
        return 'automatisations.jetonStatut.erreur';
      }
    default:
      throw new Error(props.statut);
  }
});

// Relancer
const relancer = async () =>
  await constl.automatisations.lancerManuellement({id: props.spécification.id});
</script>
