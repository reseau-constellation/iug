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
import {utiliserNumération} from '/@/plugins/localisation/localisation';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

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

const {formatterVersion} = utiliserNumération();
const versionAppliFormattée = formatterVersion(VERSION_APPLI);

const versionPlusRécente = ref<string>();
const nouvelleVersionFormattée = computed(() => {
  if (versionPlusRécente.value) return formatterVersion(versionPlusRécente.value);
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
