import {computed, onMounted, onUnmounted, watchEffect} from 'vue';
import {utiliserÉtatInfos} from '/@/état/infos';
import {isElectronRenderer} from 'wherearewe';
import {constellation, suivre} from '../../utils';
import {IPA_TÉLÉCHARGEMENTS} from '/@/consts';
import axios from 'axios';
import semver from 'semver';
import {plateforme, type publicationGitHub} from '/@/utils';

const versionPrésente = import.meta.env.VITE_APP_VERSION;
export const obtenirDernièreVersion = async (): Promise<
  {versionPlusRécente: string; urlTéléchargement: string} | undefined
> => {
  const jsonTéléchargements = (await axios.get(IPA_TÉLÉCHARGEMENTS)).data as publicationGitHub[];
  let versionPlusRécente: string | undefined = undefined;
  let urlTéléchargement: string | undefined = undefined;
  for (const t of jsonTéléchargements) {
    const version = t.name;
    if (semver.gt(version, versionPrésente)) {
      for (const fichier of t.assets) {
        const ext = fichier.name.split('.').pop();
        if (ext && extentionCompatible(ext)) {
          versionPlusRécente = version;
          urlTéléchargement = fichier.browser_download_url;
        }
      }
    }
  }
  return versionPlusRécente && urlTéléchargement
    ? {versionPlusRécente, urlTéléchargement}
    : undefined;
};
const surPlateforme = plateforme();

const extentionCompatible = (ext: string): boolean => {
  if (surPlateforme.so === 'linux') {
    return ext === 'AppImage';
  } else if (surPlateforme.so === 'mac') {
    return ext === 'dmg';
  } else if (surPlateforme.so === 'windows') {
    return ext === 'exe';
  } else {
    return false;
  }
};

export const lancerInfosMisesÀJour = () => {
  if (!isElectronRenderer) return;

  const étatInfos = utiliserÉtatInfos();

  const vérifierMisesÀJour = async () => {
    const dernièreVersion = await obtenirDernièreVersion();
    if (dernièreVersion) {
      const {versionPlusRécente, urlTéléchargement} = dernièreVersion;
      étatInfos.ajouterInfo({
        type: 'mettreÀJour',
        détails: {
          dernièreVersionDisponible: versionPlusRécente,
          versionActuelle: versionPrésente,
          urlTéléchargement,
        },
      }, 'mettreÀJour');
    }
  };

  let intervale: number;
  onMounted(() => {
    intervale = window.setInterval(vérifierMisesÀJour, 1000 * 60 * 60 * 1);
  });
  vérifierMisesÀJour();
  onUnmounted(() => {
    intervale && clearInterval(intervale);
  });
};

export const lancerInfosTélécharger = () => {
  if (isElectronRenderer) return;

  const étatInfos = utiliserÉtatInfos();

  const constl = constellation();

  const dispositifs = suivre(constl.suivreNomsDispositifs);
  const connectéÀAuMoinsUnOrdi = computed(() => {
    return (
      dispositifs.value &&
      !!Object.values(dispositifs.value).find(d => d.type === 'ordinateur' || d.type === 'serveur')
    );
  });
  let idInfo: string;
  watchEffect(() => {
    if (!connectéÀAuMoinsUnOrdi.value) {
      if (!idInfo)
        idInfo = étatInfos.ajouterInfo({
          type: 'installer',
        }, 'installer');
    } else {
      étatInfos.effacerInfo(idInfo);
    }
  });
};

export const lancerInfos = () => {
  lancerInfosMisesÀJour();
  lancerInfosTélécharger();
};
