<template>
  <v-container>
    <TitrePage entête="t('pages.téléchargements.titre')" />
    <v-toolbar class="mb-4">
      <v-row>
        <v-col cols="4">
          <v-select
            v-model="version"
            dense
            hide-details
            clearable
            outlined
            :label="t('pages.téléchargements.version')"
            :items="versions"
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="so"
            :label="t('pages.téléchargements.système')"
            :items="systèmesOpératoirs.map(x => x.nom)"
            density="compact"
            variant="outlined"
            hide-details
            clearable
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-btn
            variant="outlined"
            color="primary"
            append-icon="mdi-open-in-new"
            @click="ouvrirLien(URL_TÉLÉCHARGEMENTS)"
          >
            {{ t('pages.téléchargements.voirTous') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>

    <v-slide-x-transition
      group
      class="d-flex flex-wrap justify-center"
    >
      <CarteFichierTelechargement
        v-for="fichier in fichiersChoisis"
        :key="fichier.id"
        :url="fichier.browser_download_url"
        :version="fichier.version"
        :nom="fichier.name"
      />
    </v-slide-x-transition>
  </v-container>
</template>
<script setup lang="ts">
import axios from 'axios';
import {computed, onMounted, ref} from 'vue';

import {ouvrirLien} from '/@/utils';

import {URL_TÉLÉCHARGEMENTS, IPA_TÉLÉCHARGEMENTS} from '/@/consts';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import TitrePage from '../components/communs/TitrePage.vue';
import CarteFichierTelechargement from '../components/téléchargements/CarteFichierTéléchargement.vue';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

type SO = 'Linux' | 'macOS' | 'Windows';

interface infoSO {
  nom: SO;
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  logo: Promise<typeof import('*.png')>;
  exts: string[];
}

interface publicationGitHub {
  name: string;
  assets: itemPublicationGitHub[];
}

interface itemPublicationGitHub {
  url: string;
  id: number;
  node_id: string;
  name: string;
  label: string;
  content_type: string;
  state: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  browser_download_url: string;
}

interface publicationGitHubAvecVersion extends itemPublicationGitHub {
  version: string;
}

const obtExt = function (nomFichier: string) {
  return nomFichier.split('.').pop();
};

// Versions
const versions = ref<string[]>();

// Fichiers disponibles
const fichiers = ref<publicationGitHubAvecVersion[]>();

// Contrôles
const version = ref<string>();
const so = ref<SO>();

const fichiersChoisis = computed<publicationGitHubAvecVersion[] | undefined>(() => {
  const extsSoChoisi = systèmesOpératoirs.find(s => s.nom === so.value)?.exts;
  return fichiers.value
    ?.filter(f => !version.value || f.version === version.value)
    .filter(f => {
      const ext = obtExt(f.name);
      return !extsSoChoisi || (ext && extsSoChoisi.includes(ext));
    });
});

// Rechercher de GitHub
onMounted(async () => {
  const json: publicationGitHub[] = (await axios.get(IPA_TÉLÉCHARGEMENTS)).data;

  const extentions = ['AppImage', 'dmg', 'exe'];

  versions.value = json.map(v => v.name);
  fichiers.value = json
    .map(v =>
      v.assets
        .map(a => ({...a, version: v.name}))
        .filter(a => extentions.includes(obtExt(a.name) || '')),
    )
    .flat();
  version.value = versions.value[0];
});

const systèmesOpératoirs: infoSO[] = [
  {
    nom: 'Linux',
    logo: import('/@/assets/logosSO/Linux.png'),
    exts: ['AppImage'],
  },
  {
    nom: 'macOS',
    logo: import('/@/assets/logosSO/macOS.png'),
    exts: ['dmg'],
  },
  {
    nom: 'Windows',
    logo: import('/@/assets/logosSO/Windows.png'),
    exts: ['exe'],
  },
];
</script>
