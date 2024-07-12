<template>
  <v-chip>
    <template #prepend>
      <v-progress-circular
        v-if="enProgrès"
        indeterminate
        color="primary"
      >
      </v-progress-circular>
      <v-icon v-else-if="fichierRésolu">mdi-file</v-icon>
      <v-icon
        v-else
        color="error"
      >
        mdi-alert
      </v-icon>
    </template>
    {{ t(texteStatut) }}
  </v-chip>
</template>

<script setup lang="ts">
import type {automatisation} from '@constl/ipa';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import path from 'path';
import {computed, onMounted, ref, watchEffect} from 'vue';
import {utiliserConstellation} from '../utils';

const props = defineProps<{
  spécification: automatisation.SpécificationExporter;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = utiliserConstellation();
const dispositifPrésent = ref<string>();

// Dispositifs
onMounted(async () => {
  dispositifPrésent.value = await constl.obtIdDispositif();
});
const surCeDispositif = computed<boolean>(() => {
  return (
    !!dispositifPrésent.value && props.spécification.dispositifs.includes(dispositifPrésent.value)
  );
});

// Fichier décodé
const fichier = ref<string | null>();
const enProgrès = computed<boolean>(() => {
  return surCeDispositif.value && fichier.value === undefined;
});
watchEffect(async () => {
  fichier.value = await constl.automatisations.résoudreAdressePrivéeFichier({
    clef: props.spécification.dossier,
  });
});
const fichierRésolu = computed(() => {
  return typeof fichier.value === 'string';
});

// Texte statut
const texteStatut = computed<string>(() => {
  if (fichier.value === undefined) {
    return 'automatisation.rechercheFichier';
  } else if (fichier.value === null) {
    return 'automatisations.fichierIntrouvable';
  } else {
    return path.parse(fichier.value).base;
  }
});
</script>
