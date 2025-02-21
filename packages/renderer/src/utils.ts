import {
  choisirDossier as choisirDossier_,
  choisirFichierSauvegarde as choisirFichierSauvegarde_,
  demanderAccèsMédia as demanderAccèsMédia_,
  surLinux,
  surMac,
  surWindows,
} from '#preload';
import type {dialog} from 'electron';
import {showSaveFilePicker} from 'native-file-system-adapter';
import {os} from 'platform';
import {computed, type ComputedRef, type Ref} from 'vue';
import {isBrowser, isElectronRenderer} from 'wherearewe';

export const ouvrirLien = (lien: string) => {
  window.open(lien, '_blank'); // À faire : tester sous Électron
};

export async function copier(texte: string): Promise<void> {
  await navigator.clipboard?.writeText(texte);
}

export type fichierPublicationGitHub = {
  url: string;
  browser_download_url: string;
  id: number;
  node_id: string;
  name: string;
  label: string;
  state: string;
  content_type: string;
  size: number;
  download_count: number;
  created_at: number;
  updated_at: number;
  uploader: auteurGitHub;
};

export type auteurGitHub = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
};

export type publicationGitHub = {
  url: string;
  html_url: string;
  assets_url: string;
  upload_url: string;
  tarball_url: string;
  zipball_url: string;
  discussion_url: string;
  id: number;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  author: auteurGitHub;
  assets: fichierPublicationGitHub[];
};

export interface interfaceCouleurScore {
  couleur: string;
  note: string;
}

export function couleurScore(score?: number | null): interfaceCouleurScore {
  if (score === null || score === undefined) return {couleur: 'grey lighten-2', note: '?'};
  score *= 100;
  if (score >= 95) {
    return {couleur: '#1e7145', note: 'A'};
  } else if (score >= 90) {
    return {couleur: '#00a300', note: 'A-'};
  } else if (score >= 85) {
    return {couleur: '#99b433', note: 'B'};
  } else if (score >= 80) {
    return {couleur: '#ffc40d', note: 'B-'};
  } else if (score >= 70) {
    return {couleur: '#e3a21a', note: 'C+'};
  } else if (score >= 60) {
    return {couleur: '#da532c', note: 'C'};
  } else if (score >= 55) {
    return {couleur: '#ee1111', note: 'D'};
  } else {
    return {couleur: '#b91d47', note: 'F'};
  }
}

export const couper = (texte: string, nMax: number, troisPetitsPoints: string) => {
  if ([...texte].length <= nMax) return texte;
  else return texte.slice(0, 20) + troisPetitsPoints;
};

export const ajusterTexteTraductible = ({
  anciennes,
  nouvelles,
}: {
  anciennes: {[lng: string]: string} | undefined;
  nouvelles: {[lng: string]: string};
}): {àEffacer: string[]; àAjouter: {[lng: string]: string}} => {
  const àEffacer = Object.keys(anciennes || {}).filter(
    lng => !Object.keys(nouvelles).includes(lng),
  );
  const àAjouter = Object.fromEntries(
    Object.entries(nouvelles).filter(([lng, val]) => (anciennes || {})[lng] !== val),
  );
  return {àEffacer, àAjouter};
};

export type InfoPlateforme = {
  plateforme: 'électron' | 'navigateur' | undefined;
  so: 'windows' | 'linux' | 'mac' | 'iOS' | 'androïde' | undefined;
};

export const plateforme = (): InfoPlateforme => {
  if (isElectronRenderer) {
    const so = surLinux ? 'linux' : surMac ? 'mac' : surWindows ? 'windows' : undefined;
    return {
      plateforme: 'électron',
      so,
    };
  } else if (isBrowser) {
    let so: InfoPlateforme['so'] = undefined;
    if (os?.family?.includes('Windows')) {
      so = 'windows';
    } else if (os?.family?.includes('OS X')) {
      so = 'mac';
    } else if (
      os?.family &&
      ['Linux', 'Ubuntu', 'Debian', 'Fedora', 'Red Hat', 'SuSE'].includes(os.family)
    ) {
      so = 'linux';
    } else if (os?.family?.includes('iOS')) {
      so = 'iOS';
    } else if (os?.family?.includes('Android')) {
      so = 'androïde';
    }
    return {
      plateforme: 'navigateur',
      so,
    };
  } else {
    return {
      plateforme: undefined,
      so: undefined,
    };
  }
};

export const sourceImage = (
  image: Ref<Uint8Array | null | undefined>,
): ComputedRef<string | null | undefined> => {
  return computed(() => {
    if (image.value) {
      return URL.createObjectURL(new Blob([image.value], {type: 'image'}));
    } else {
      return undefined;
    }
  });
};

export const choisirDossier = async (): Promise<string | undefined> => {
  if (!isElectronRenderer) return undefined;
  return await choisirDossier_();
};

export const choisirFichierSauvegarde = async (
  options: Parameters<typeof dialog.showSaveDialog>[0] = {},
): Promise<string | undefined> => {
  if (!isElectronRenderer) return undefined;
  return await choisirFichierSauvegarde_(options);
};

export const demanderAccèsMédia = async (
  média: 'microphone' | 'camera',
): Promise<boolean | undefined> => {
  if (!isElectronRenderer) return undefined;
  return await demanderAccèsMédia_(média);
};

export const itérableÀFlux = (itérable: AsyncIterable<Uint8Array>): ReadableStream<Uint8Array> => {
  const itérateur = itérable[Symbol.asyncIterator]();

  return new ReadableStream({
    async pull(contrôleur) {
      const {value, done} = await itérateur.next();

      if (done) {
        contrôleur.close();
      } else {
        contrôleur.enqueue(value);
      }
    },
  });
};

export const téléchargerFlux = async ({
  flux,
  nom,
  types,
}: {
  flux: ReadableStream;
  nom: string;
  types?: Exclude<Parameters<typeof showSaveFilePicker>[0], undefined>['types'];
}) => {
  const accèesFichier = await showSaveFilePicker({
    _preferPolyfill: false,
    suggestedName: nom,
    types,
  });
  await flux.pipeTo(await accèesFichier.createWritable());
};
