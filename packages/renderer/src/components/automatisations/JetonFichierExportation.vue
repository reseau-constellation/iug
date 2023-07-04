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
    {{ texteStatut }}
  </v-chip>
</template>

<script setup lang="ts">
import type {automatisation} from '@constl/ipa';
import type {client} from '@constl/ipa';
import path from 'path';
import {computed, ref, inject, onMounted, watchEffect} from 'vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const props = defineProps<{
  spécification: automatisation.SpécificationExporter;
}>();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const constl = inject<client.ClientConstellation>('constl');
const dispositifPrésent = ref<string>();

// Dispositifs
onMounted(async () => {
  dispositifPrésent.value = await constl?.obtIdOrbite();
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
  fichier.value = await constl?.automatisations?.résoudreAdressePrivéeFichier({
    clef: props.spécification.dossier,
  });
});
const fichierRésolu = computed(() => {
  return typeof fichier.value === 'string';
});

// Texte statut
const texteStatut = computed<string>(() => {
  if (fichier.value === undefined) {
    return t('automatisation.rechercheFichier');
  } else if (fichier.value === null) {
    return t('automatisations.fichierIntrouvable');
  } else {
    return path.parse(fichier.value).base;
  }
});
</script>
