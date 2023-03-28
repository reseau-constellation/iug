import type {catégorieVariables} from '@constl/ipa/dist/src/variables';

export const ouvrirLien = (lien: string) => {
  window.open(lien); // À faire : tester sous Électron
};

export async function copier(texte: string): Promise<void> {
  await navigator.clipboard?.writeText(texte); // À faire : ça fonctionne pas avec Électron
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

export const icôneCatégorieVariable = (catégorie: catégorieVariables): string => {
  if (typeof catégorie === 'string') {
    switch (catégorie) {
      case 'numérique':
        return 'mdi-numeric';
      case 'chaîne':
        return 'mdi-text-short';
      case 'catégorique':
        return 'mdi-view-list';
      case 'booléen':
        return 'mdi-order-bool-ascending-variant';
      case 'géojson':
        return 'mdi-map-marker';
      case 'fichier':
        return 'mdi-file';
      case 'vidéo':
        return 'mdi-play-box-outline';
      case 'audio':
        return 'mdi-waveform';
      case 'image':
        return 'mdi-image';
      case 'intervaleTemps':
        return 'mdi-calendar-range-outline';
      case 'horoDatage':
        return 'mdi-calendar-clock';
      default:
        return '';
    }
  } else {
    return 'mdi-list';
  }
};

export interface interfaceCouleurScore {
  couleur: string;
  note: string;
}

export function couleurScore(score: number | null): interfaceCouleurScore {
  if (score === null) return {couleur: '#666666', note: '?'};
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
