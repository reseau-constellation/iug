import type {ComputedRef, Ref} from 'vue';
import type {types, ClientConstellation} from '@constl/ipa';

import EventEmitter, {once} from 'events';
import {computed, inject, onMounted, onUnmounted, ref, watch, watchEffect} from 'vue';
import Semaphore from 'semaphore-async-await';

export const constellation = (): ClientConstellation => {
  const constl = inject<ClientConstellation>('constl');
  if (constl) return constl;
  throw new Error("Constellation n'est pas trouvable.");
};

export const suivre = <
  U,
  V extends U | undefined,
  W extends
    | types.schémaFonctionOublier
    | types.schémaRetourFonctionRechercheParProfondeur
    | types.schémaRetourFonctionRechercheParN,
  T extends {[clef: string]: types.élémentsBd | undefined} = Record<string, never>,
>(
  fonc: (args: T & {f: types.schémaFonctionSuivi<U>}) => Promise<W>,
  args: T = {} as T,
  défaut?: V,
): ComputedRef<U | V> => {
  const val = ref(défaut) as Ref<U | V>;

  let fOublier: types.schémaFonctionOublier | undefined = undefined;

  const argsFinaux = {
    ...args,
    f: (x: U) => (val.value = x),
  };
  onMounted(async () => {
    const résultat = await fonc(argsFinaux);
    if (résultat instanceof Function) {
      fOublier = résultat;
    } else {
      fOublier = résultat?.fOublier;
    }
  });
  onUnmounted(async () => {
    if (fOublier) await fOublier();
  });

  return computed(() => val.value);
};

export const enregistrerÉcoute = <
  T extends
    | types.schémaFonctionOublier
    | types.schémaRetourFonctionRechercheParProfondeur
    | types.schémaRetourFonctionRechercheParN,
>(
  promesseÉcoute?: Promise<T>,
): Promise<T | undefined> => {
  let fOublier: types.schémaFonctionOublier | undefined = undefined;

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

// Solution TypeScript de https://stackoverflow.com/a/48181378 (CC BY-SA 3.0)
type ObtTypeInterne<S> = S extends Ref<infer V> ? V : never;

export const enregistrerÉcouteDynamique = <T extends {[prm: string]: Ref}, U>({
  params,
  fÉcoute,
}: {
  params: T;
  fÉcoute: (
    params: {[K in keyof T]: Exclude<ObtTypeInterne<T[K]>, undefined>},
    f: types.schémaFonctionSuivi<U>,
  ) => Promise<types.schémaFonctionOublier> | undefined;
}): ComputedRef<U | undefined> => {
  const résultat = ref<U>();

  let fOublier: types.schémaFonctionOublier | undefined;

  const définis = computed(() => {
    const valeursParams = Object.fromEntries(
      Object.entries(params).map(([p, v]) => [p, v.value]),
    ) as {
      [K in keyof T]: ObtTypeInterne<T[K]>;
    };
    if (Object.values(valeursParams).every(x => x !== undefined)) {
      return valeursParams as {[K in keyof T]: Exclude<ObtTypeInterne<T[K]>, undefined>};
    } else {
      return undefined;
    }
  });

  const lancerÉcoute = async () => {
    if (fOublier) await fOublier();
    if (définis.value) {
      fOublier = await enregistrerÉcoute(fÉcoute(définis.value, x => (résultat.value = x)));
    } else {
      résultat.value = undefined;
    }
  };
  watch(Object.values(params), lancerÉcoute);
  lancerÉcoute();

  return computed(() => résultat.value); // Pour enlever la tentation de l'éditer directement
};

export const rechercher = <T, U, C extends string>({
  requète,
  fRecherche,
  clefRequète,
}: {
  requète: Ref<T | undefined>;
  fRecherche: (
    args: {
      f: (x: U[]) => void;
      nRésultatsDésirés: number;
    } & {
      [k in typeof clefRequète]: string;
    },
  ) => Promise<types.schémaRetourFonctionRechercheParN>;
  clefRequète: C;
}): {résultats: Ref<U[] | undefined>; n: Ref<number>; onTravaille: Ref<boolean>} => {
  const réfRésultat: Ref<U[] | undefined> = ref();
  const onTravaille = ref(true);

  let fOublierRecherche: types.schémaFonctionOublier | undefined = undefined;
  let fChangerN: (n: number) => Promise<void>;

  const nOuProfondeurRésultats = ref(10);

  const verrou = new Semaphore(1);
  let annulé = false;

  const lancerRecherche = async () => {
    const requèteAvant = requète.value;
    onTravaille.value = true;

    // Attendre une seconde pour laisser aux personnes le temps d'écrire
    await new Promise(résoudre => setTimeout(résoudre, 1000));

    // Arrêter maintenant si la requète n'est plus à jour
    await verrou.acquire();
    if (requèteAvant !== requète.value) {
      verrou.release();
      return;
    }

    if (fOublierRecherche) await fOublierRecherche();
    if (annulé) return;
    if (requète.value) {
      //@ts-expect-error Je ne sais pas comment faire ça
      const retour = await fRecherche({
        [clefRequète]: requète.value,
        nRésultatsDésirés: nOuProfondeurRésultats.value,
        f: x => {
          réfRésultat.value = x;
          onTravaille.value = false;
        },
      });

      fOublierRecherche = retour.fOublier;
      fChangerN = retour.fChangerN;
    } else {
      réfRésultat.value = [];
      onTravaille.value = false;
    }
    verrou.release();
  };

  watch(requète, lancerRecherche);
  lancerRecherche();
  watchEffect(async () => {
    if (fChangerN) fChangerN(nOuProfondeurRésultats.value);
  });

  onUnmounted(async () => {
    annulé = true;
    await verrou.acquire();
    if (fOublierRecherche) await fOublierRecherche();
  });

  return {
    résultats: réfRésultat,
    n: nOuProfondeurRésultats,
    onTravaille,
  };
};

export class MultiChercheur {
  nOuProfondeur: Ref<number>;
  fOublierRecherche?: types.schémaFonctionOublier;

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
      | types.schémaRetourFonctionRechercheParN
      | types.schémaRetourFonctionRechercheParProfondeur
      | undefined
    >;
    fRechercheDéfaut?: ({
      nOuProfondeur,
      réfRésultat,
    }: {
      nOuProfondeur: number;
      réfRésultat: Ref;
    }) => Promise<
      | types.schémaRetourFonctionRechercheParN
      | types.schémaRetourFonctionRechercheParProfondeur
      | undefined
    >;
  }): Promise<void> {
    if (this.fOublierRecherche) {
      await this.fOublierRecherche();
      this.fOublierRecherche = undefined;
    }

    let fOublierRecherche: types.schémaFonctionOublier | undefined = undefined;
    let fChangerNOuProfondeur: (n: number) => Promise<void>;

    const vérifierSiParProfondeur = (
      x: types.schémaRetourFonctionRechercheParN | types.schémaRetourFonctionRechercheParProfondeur,
    ): x is types.schémaRetourFonctionRechercheParProfondeur => {
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

export const icôneObjet = (typeObjet?: string): string | undefined => {
  switch (typeObjet) {
    case 'motClef':
      return 'mdi-key';
    case 'tableau':
      return 'mdi-table';
    case 'bd':
      return 'mdi-database-outline';
    case 'projet':
      return 'mdi-folder-outline';
    case 'nuée':
      return 'mdi-account-group-outline';
  }
};
