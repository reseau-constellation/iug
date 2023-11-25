<template>
  <v-alert
    type="success"
    variant="outlined"
    closable
  >
    {{
      t('avertissements.miseÀJour.texte', {
        versionCourante: versionAppliFormattée,
        nouvelleVersion: nouvelleVersionFormattée,
      })
    }}
    <v-btn
      class="mx-2 my-2"
      variant="outlined"
      color="primary"
      @click="ouvrirLien(urlTéléchargement)"
    >
      {{ t('avertissements.miseÀJour.télécharcher') }}
      <v-icon end>mdi-download</v-icon>
    </v-btn>
  </v-alert>
</template>

<script setup lang="ts">
import {onMounted, ref, computed} from 'vue';

import axios from 'axios';
import semver from 'semver';
import {surLinux, surMac, surWindows} from '#preload';

import {ouvrirLien, type publicationGitHub} from '/@/utils';
import {IPA_TÉLÉCHARGEMENTS, URL_TÉLÉCHARGEMENTS} from '/@/consts';
import {கிளிமூக்கை_பயன்படுத்து, எண்களைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const {பதிப்பை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();

const extentionCompatible = (ext: string): boolean => {
  if (surLinux) {
    return ext === 'AppImage';
  } else if (surMac) {
    return ext === 'dmg';
  } else if (surWindows) {
    return ext === 'exe';
  } else {
    return false;
  }
};

const VERSION_APPLI = import.meta.env.VITE_APP_VERSION;

const versionAppliFormattée = பதிப்பை_வடிவூட்டு(VERSION_APPLI);

const versionPlusRécente = ref<string>();
const nouvelleVersionFormattée = computed(() => {
  if (versionPlusRécente.value) return பதிப்பை_வடிவூட்டு(versionPlusRécente.value);
  return undefined;
});

const urlTéléchargement = ref(URL_TÉLÉCHARGEMENTS);

onMounted(async () => {
  const jsonTéléchargements = (await axios.get(IPA_TÉLÉCHARGEMENTS)).data as publicationGitHub[];
  for (const t of jsonTéléchargements) {
    const version = t.name;
    if (semver.gt(version, VERSION_APPLI)) {
      for (const fichier of t.assets) {
        const ext = fichier.name.split('.').pop();
        if (ext && extentionCompatible(ext)) {
          versionPlusRécente.value = version;
          urlTéléchargement.value = fichier.browser_download_url;
        }
      }
    }
  }
});
</script>
