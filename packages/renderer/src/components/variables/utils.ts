import type {variables} from '@constl/ipa';

export const catégoriesBase: variables.catégorieBaseVariables[] = [
  'numérique',
  'horoDatage',
  'intervaleTemps',
  'chaîne',
  'chaîneNonTraductible',
  'booléen',
  'géojson',
  'vidéo',
  'audio',
  'image',
  'fichier',
];

export const icôneCatégorieVariable = (catégorie: variables.catégorieVariables): string => {
  if (catégorie.type === 'simple') {
    switch (catégorie.catégorie) {
      case 'numérique':
        return 'mdi-numeric';
      case 'chaîneNonTraductible':
      case 'chaîne':
        return 'mdi-text-short';
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
