<template>
  <v-chip>
    <template #prepend>
      <v-progress-circular
        v-if="enProgrès"
        indeterminate
        color="primary"
      >
      </v-progress-circular>
      <v-icon v-else-if="sourceRésolue">{{ icône }}</v-icon>
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
import {computed, ref, watchEffect} from 'vue';
import {utiliserConstellation} from '../utils';

const props = defineProps<{
  spécification: automatisation.SpécificationImporter;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = utiliserConstellation();

// Statut source
const enProgrès = computed<boolean>(() => {
  if (props.spécification.source.typeSource === 'fichier') {
    return fichier.value === undefined;
  } else {
    return false;
  }
});
const sourceRésolue = computed(() => {
  return props.spécification.source.typeSource === 'url' || typeof fichier.value === 'string';
});

// Fichier décodé
const fichier = ref<string | null>();
watchEffect(async () => {
  if (props.spécification.source.typeSource === 'fichier') {
    fichier.value = await constl.automatisations.résoudreAdressePrivéeFichier({
      clef: props.spécification.source.adresseFichier,
    });
  }
});

// Icône
const icône = computed(() => {
  if (props.spécification.source.typeSource === 'fichier') {
    return 'mdi-file';
  } else {
    return 'mdi-web';
  }
});

// Texte statut
const texteStatut = computed<string>(() => {
  if (props.spécification.source.typeSource === 'fichier') {
    if (fichier.value === undefined) {
      return 'automatisations.rechercheFichier';
    } else if (fichier.value === null) {
      return 'automatisations.fichierIntrouvable';
    } else {
      return path.parse(fichier.value).base;
    }
  } else {
    return props.spécification.source.url.slice(-10) + t('communs.troisPetitsPoints');
  }
});
</script>
