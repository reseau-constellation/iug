import type {
  schémaFonctionOublier,
  schémaRetourFonctionRechercheParN,
  schémaRetourFonctionRechercheParProfondeur,
} from '@constl/ipa/dist/src/utils';
import EventEmitter, {once} from 'events';
import {onMounted, onUnmounted} from 'vue';

export const enregistrerÉcoute = <
  T extends
    | schémaFonctionOublier
    | schémaRetourFonctionRechercheParProfondeur
    | schémaRetourFonctionRechercheParN,
>(
  promesseÉcoute?: Promise<T>,
): Promise<T | undefined> => {
  let fOublier: schémaFonctionOublier | undefined = undefined;

  const événements = new EventEmitter();
  let résultat: T | undefined;
  const promesseRetour = new Promise<T | undefined>(résoudre => {
    once(événements, 'prêt').then(() => {
      résoudre(résultat);
    });
  });

  onMounted(async () => {
    résultat = await promesseÉcoute;
    if (résultat instanceof Function) {
      fOublier = résultat;
    } else {
      fOublier = résultat?.fOublier;
    }
    événements.emit('prêt');
  });
  onUnmounted(async () => {
    if (fOublier) await fOublier();
  });

  return promesseRetour;
};
