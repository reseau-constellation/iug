<template>
  <v-card
    class="ma-3 pa-5"
    :max-width="300"
    @click="ouvrirLien(url)"
  >
    <v-img
      :src="imgFinale"
      contain
      max-height="150"
    />
    <v-card-item>
      <v-card-title class="d-flex">
        {{ systèmeOpératoire }}
        <v-spacer />
        <v-btn icon="mdi-download" />
      </v-card-title>
    </v-card-item>
    <v-card-text>
      {{ t('téléchargements.version', {version: versionFormattée}) }}
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import {computed, ref} from 'vue';
import {ouvrirLien} from '/@/utils';
import {utiliserImagesDéco} from '/@/composables/images';
import {utiliserNumération} from '/@/plugins/localisation/localisation';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {watchEffect} from 'vue';

const props = defineProps<{url: string; version: string; nom: string}>();

const {formatterVersion} = utiliserNumération();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {obtImageDéco} = utiliserImagesDéco();

// Version
const versionFormattée = formatterVersion(props.version);

// SO
const exts = {
  Linux: ['AppImage'],
  macOS: ['dmg'],
  Windows: ['exe'],
};
const obtExt = function (nomFichier: string) {
  return nomFichier.split('.').pop();
};
const systèmeOpératoire = computed<'Linux' | 'macOS' | 'Windows' | undefined>(() => {
  const ext = obtExt(props.nom);
  if (!ext) return;
  const so = Object.entries(exts).find(([_, e]) => e.includes(ext))?.[0] as
    | 'Linux'
    | 'macOS'
    | 'Windows'
    | undefined;
  return so;
});

// Image
const images = {
  Linux: import('/@/assets/logosSO/Linux.png'),
  macOS: import('/@/assets/logosSO/macOS.png'),
  Windows: import('/@/assets/logosSO/Windows.png'),
};

const imgSO = ref<string>();
watchEffect(async () => {
  if (systèmeOpératoire.value) imgSO.value = (await images[systèmeOpératoire.value]).default;
});

const imgDéfaut = obtImageDéco('docs');
const imgFinale = computed(() => {
  return imgSO.value || imgDéfaut.value;
});
</script>
