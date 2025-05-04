<template>
  <v-chip
    variant="outlined"
    label
    density="compact"
  >
    <template #prepend>
      <v-progress-circular
        v-if="enProgrès"
        class="me-2"
        indeterminate
        size="15"
        width="2"
        color="primary"
      />
      <v-icon
        v-else-if="fichierRésolu"
        start
      >
        mdi-file-outline
      </v-icon>
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

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import path from 'path';
import {computed, onMounted, ref} from 'vue';
import {utiliserConstellation} from '../utils';

const props = defineProps<{
  spécification: automatisation.SpécificationExporter;
}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

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
const enProgrès = computed<boolean>(() => {
  return surCeDispositif.value && props.spécification.dossier === undefined;
});

const fichierRésolu = computed(() => {
  return typeof props.spécification.dossier === 'string';
});

// Texte statut
const texteStatut = computed<string>(() => {
  if (props.spécification.dossier) {
    return path.parse(props.spécification.dossier).base;
  } else {
    return 'automatisations.fichierIntrouvable';
  }
});
</script>
