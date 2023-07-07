import type {utils} from '@constl/ipa';

import EventEmitter, {once} from 'events';
import type {Ref} from 'vue';
import {onMounted, onUnmounted, ref, watch, watchEffect} from 'vue';

export const enregistrerÉcoute = <
  T extends
    | utils.schémaFonctionOublier
    | utils.schémaRetourFonctionRechercheParProfondeur
    | utils.schémaRetourFonctionRechercheParN,
>(
  promesseÉcoute?: Promise<T>,
): Promise<T | undefined> => {
  let fOublier: utils.schémaFonctionOublier | undefined = undefined;

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

export const enregistrerRecherche = <T, V, U extends V>({
  requète,
  réfRésultat,
  fRecherche,
  fRechercheDéfaut,
}: {
  requète: Ref<T | undefined>;
  réfRésultat: Ref<U[] | undefined>;
  fRecherche: ({
    requète,
    nOuProfondeur,
    réfRésultat,
  }: {
    requète: T;
    nOuProfondeur: number;
    réfRésultat: Ref<U[] | undefined>;
  }) => Promise<
    | utils.schémaRetourFonctionRechercheParN
    | utils.schémaRetourFonctionRechercheParProfondeur
    | undefined
  >;
  fRechercheDéfaut?: ({
    nOuProfondeur,
    réfRésultat,
  }: {
    nOuProfondeur: number;
    réfRésultat: Ref<V[] | undefined>;
  }) => Promise<
    | utils.schémaRetourFonctionRechercheParN
    | utils.schémaRetourFonctionRechercheParProfondeur
    | undefined
  >;
}): Ref<number> => {
  let fOublierRecherche: utils.schémaFonctionOublier | undefined = undefined;
  let fChangerNOuProfondeur: (n: number) => Promise<void>;

  const nOuProfondeurRésultats = ref(10);

  const vérifierSiParProfondeur = (
    x: utils.schémaRetourFonctionRechercheParN | utils.schémaRetourFonctionRechercheParProfondeur,
  ): x is utils.schémaRetourFonctionRechercheParProfondeur => {
    // @ts-expect-error Je ne sais pas comment faire ça
    return !!x['fChangerProfondeur'];
  };

  const lancerRecherche = async () => {
    if (fOublierRecherche) await fOublierRecherche();
    if (requète.value) {
      const retour = await fRecherche({
        requète: requète.value,
        nOuProfondeur: nOuProfondeurRésultats.value,
        réfRésultat,
      });

      if (retour) {
        fOublierRecherche = retour.fOublier;
        fChangerNOuProfondeur = vérifierSiParProfondeur(retour)
          ? retour.fChangerProfondeur
          : retour.fChangerN;
      }
    } else {
      if (fRechercheDéfaut) {
        const retour = await fRechercheDéfaut({
          nOuProfondeur: nOuProfondeurRésultats.value,
          réfRésultat,
        });

        if (retour) {
          fOublierRecherche = retour.fOublier;
          fChangerNOuProfondeur = vérifierSiParProfondeur(retour)
            ? retour.fChangerProfondeur
            : retour.fChangerN;
        }
      } else {
        réfRésultat.value = [];
      }
    }
  };

  watch(requète, lancerRecherche);
  lancerRecherche();
  watchEffect(async () => {
    if (fChangerNOuProfondeur) fChangerNOuProfondeur(nOuProfondeurRésultats.value);
  });

  onUnmounted(async () => {
    if (fOublierRecherche) await fOublierRecherche();
  });

  return nOuProfondeurRésultats;
};

export class MultiChercheur {
  nOuProfondeur: Ref<number>;
  fOublierRecherche?: utils.schémaFonctionOublier;

  constructor() {
    this.nOuProfondeur = ref(10);
    onUnmounted(async () => {
      if (this.fOublierRecherche) await this.fOublierRecherche();
    });
  }
  async lancerRecherche<T>({
    requète,
    réfRésultat,
    fRecherche,
    fRechercheDéfaut,
  }: {
    requète: Ref<T | undefined>;
    réfRésultat: Ref;
    fRecherche: ({
      requète,
      nOuProfondeur,
      réfRésultat,
    }: {
      requète: T;
      nOuProfondeur: number;
      réfRésultat: Ref;
    }) => Promise<
      | utils.schémaRetourFonctionRechercheParN
      | utils.schémaRetourFonctionRechercheParProfondeur
      | undefined
    >;
    fRechercheDéfaut?: ({
      nOuProfondeur,
      réfRésultat,
    }: {
      nOuProfondeur: number;
      réfRésultat: Ref;
    }) => Promise<
      | utils.schémaRetourFonctionRechercheParN
      | utils.schémaRetourFonctionRechercheParProfondeur
      | undefined
    >;
  }): Promise<void> {
    if (this.fOublierRecherche) {
      await this.fOublierRecherche();
      this.fOublierRecherche = undefined;
    }

    let fOublierRecherche: utils.schémaFonctionOublier | undefined = undefined;
    let fChangerNOuProfondeur: (n: number) => Promise<void>;

    const vérifierSiParProfondeur = (
      x: utils.schémaRetourFonctionRechercheParN | utils.schémaRetourFonctionRechercheParProfondeur,
    ): x is utils.schémaRetourFonctionRechercheParProfondeur => {
      // @ts-expect-error Je ne sais pas comment faire ça
      return !!x['fChangerProfondeur'];
    };

    const lancerRecherche = async () => {
      if (fOublierRecherche) await fOublierRecherche();
      if (requète.value) {
        const retour = await fRecherche({
          requète: requète.value,
          nOuProfondeur: this.nOuProfondeur.value,
          réfRésultat,
        });

        if (retour) {
          fOublierRecherche = retour.fOublier;
          fChangerNOuProfondeur = vérifierSiParProfondeur(retour)
            ? retour.fChangerProfondeur
            : retour.fChangerN;
        }
      } else {
        if (fRechercheDéfaut) {
          const retour = await fRechercheDéfaut({
            nOuProfondeur: this.nOuProfondeur.value,
            réfRésultat,
          });

          if (retour) {
            fOublierRecherche = retour.fOublier;
            fChangerNOuProfondeur = vérifierSiParProfondeur(retour)
              ? retour.fChangerProfondeur
              : retour.fChangerN;
          }
        } else {
          réfRésultat.value = [];
        }
      }
    };

    watch(requète, lancerRecherche);
    lancerRecherche();
    watchEffect(async () => {
      if (fChangerNOuProfondeur) fChangerNOuProfondeur(this.nOuProfondeur.value);
    });

    this.fOublierRecherche = fOublierRecherche;
  }
}
