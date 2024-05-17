import {type ComputedRef, type Ref, unref, type MaybeRef, type UnwrapRef, isRef} from 'vue';
import type {types, ClientConstellation} from '@constl/ipa';

import EventEmitter, {once} from 'events';
import {computed, inject, onMounted, onUnmounted, ref, watch, watchEffect} from 'vue';
import deepEqual from 'deep-equal';
import type {கிளிமூக்கு as கிளிமூக்கு_வகை} from '@lassi-js/kilimukku';

export const constellation = (): ClientConstellation => {
  const constl = inject<ClientConstellation>('constl');
  if (constl) return constl;
  throw new Error("Constellation n'est pas trouvable.");
};

export const கிளிமூக்கு = (): கிளிமூக்கு_வகை => {
  const kilimukku = inject<கிளிமூக்கு_வகை>('கிளிமூக்கு');
  if (kilimukku) return kilimukku;
  throw new Error("Kilimukku n'est pas trouvable.");
};

export type DébalerRéf<T> = T extends Ref<infer R> ? R : T;
export type DébalerRéfsArgs<T> = {[K in keyof T]: DébalerRéf<T[K]>};

const débalerRéfsArgs = <T extends {[clef: string]: MaybeRef<types.élémentsBd | undefined>}>(
  args: T,
): DébalerRéfsArgs<T> => {
  return Object.fromEntries(
    Object.entries(args).map(([clef, val]) => [clef, unref(val)]),
  ) as DébalerRéfsArgs<T>;
};

class Stabilisateur {
  n: number;
  valeurAntérieure?: {[clef: string]: types.élémentsBd | undefined};

  constructor(n = 1000) {
    this.n = n;
  }
  async stabiliser(args: {[clef: string]: types.élémentsBd | undefined}): Promise<boolean> {
    // Arrêter tout de suite si ces valeurs ont déjà été soumises
    if (deepEqual(args, this.valeurAntérieure)) return false;

    this.valeurAntérieure = args;

    return new Promise(résoudre => {
      setTimeout(() => résoudre(deepEqual(args, this.valeurAntérieure)), this.n);
    });
  }
}

export const suivre = <
  U,
  V extends U | undefined,
  W extends types.schémaFonctionOublier,
  T extends {[clef: string]: MaybeRef<types.élémentsBd | undefined>} = Record<string, never>,
>(
  fonc: (
    args: {
      [K in keyof T]: DébalerRéf<
        T[K] extends Ref ? Ref<Exclude<UnwrapRef<T[K]>, undefined>> : T[K]
      >;
    } & {f: types.schémaFonctionSuivi<U>},
  ) => Promise<W>,
  args: T = {} as T,
  défaut?: V,
): ComputedRef<U | V> => {
  const val = ref(défaut) as Ref<U | V>;
  const stab = new Stabilisateur();

  let fOublier: types.schémaFonctionOublier | undefined = undefined;
  const dynamique = Object.values(args).some(x => isRef(x));

  const définis = computed(() => {
    const argsFinaux = débalerRéfsArgs(args);
    if (Object.values(argsFinaux).every(x => x !== undefined)) {
      return argsFinaux as {
        [K in keyof T]: DébalerRéf<
          T[K] extends Ref ? Ref<Exclude<UnwrapRef<T[K]>, undefined>> : T[K]
        >;
      };
    } else {
      return undefined;
    }
  });

  watchEffect(async () => {
    if (fOublier) {
      await fOublier();
      fOublier = undefined;
    }
    if (définis.value) {
      // Si les intrants sont dynamiques, stabiliser suite à la première exécution
      if (dynamique && fOublier) {
        const stable = await stab.stabiliser(définis.value);
        if (!stable) return;
      }

      fOublier = await fonc({
        ...définis.value,
        f: (x: U) => (val.value = x),
      });
    }
  });

  onUnmounted(async () => {
    if (fOublier) await fOublier();
  });

  return computed(() => val.value);
};

export const obt = <
  U,
  T extends {[clef: string]: types.élémentsBd | undefined} = Record<string, never>,
>(
  fonc: (args: T) => Promise<U>,
  args: T = {} as T,
): ComputedRef<U | undefined> => {
  const val = ref<U | undefined>();
  onMounted(async () => {
    const résultat = await fonc(args);
    val.value = résultat;
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

export const rechercher = <
  U,
  W extends
    | types.schémaRetourFonctionRechercheParN
    | types.schémaRetourFonctionRechercheParProfondeur,
  T extends {[clef: string]: MaybeRef<types.élémentsBd | undefined>} = Record<string, never>,
>(
  fonc: (
    args: {
      [K in keyof T]: DébalerRéf<
        T[K] extends Ref ? Ref<Exclude<UnwrapRef<T[K]>, undefined>> : T[K]
      >;
    } & {f: types.schémaFonctionSuivi<U>},
  ) => Promise<W>,
  args: T = {} as T,
): {résultats: Ref<U | undefined>; onTravaille: Ref<boolean>} => {
  const réfRésultat: Ref<U | undefined> = ref();
  const onTravaille = ref(true);

  const stab = new Stabilisateur();
  const dynamique = Object.values(args).some(x => isRef(x));

  let fOublier: types.schémaFonctionOublier | undefined = undefined;
  let fChangerNOuProfondeur: (n: number) => Promise<void>;
  const vérifierSiParProfondeur = (
    x: types.schémaRetourFonctionRechercheParN | types.schémaRetourFonctionRechercheParProfondeur,
  ): x is types.schémaRetourFonctionRechercheParProfondeur => {
    return !!(x as types.schémaRetourFonctionRechercheParProfondeur).fChangerProfondeur;
  };

  const définis = computed(() => {
    const argsFinaux = débalerRéfsArgs(args);
    if (Object.values(argsFinaux).every(x => x !== undefined)) {
      return argsFinaux as {
        [K in keyof T]: DébalerRéf<
          T[K] extends Ref ? Ref<Exclude<UnwrapRef<T[K]>, undefined>> : T[K]
        >;
      };
    } else {
      return undefined;
    }
  });

  watchEffect(async () => {
    onTravaille.value = true;

    if (fOublier) {
      fOublier(); // Très bizare... `await` ici détruit la réactivité
      fOublier = undefined;
    }

    if (définis.value) {
      // Si les intrants sont dynamiques, stabiliser
      if (dynamique) {
        const stable = await stab.stabiliser(définis.value);
        if (!stable) return;
      }

      const retour = await fonc({
        ...définis.value,
        f: x => {
          réfRésultat.value = x;
          onTravaille.value = false;
        },
      });
      fOublier = retour.fOublier;

      fChangerNOuProfondeur = vérifierSiParProfondeur(retour)
        ? retour.fChangerProfondeur
        : retour.fChangerN;
    } else {
      réfRésultat.value = undefined;
      onTravaille.value = false;
    }
  });
  const réfNOuProfondeur = computed<number | undefined>(() => {
    return (args['nRésultatsDésirés'] || args['pronfondeur']) as number | undefined;
  });
  watchEffect(async () => {
    if (fChangerNOuProfondeur && réfNOuProfondeur.value)
      fChangerNOuProfondeur(réfNOuProfondeur.value);
  });

  onUnmounted(async () => {
    if (fOublier) await fOublier();
  });

  return {
    résultats: réfRésultat,
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
    requête,
    réfRésultat,
    fRecherche,
    fRechercheDéfaut,
  }: {
    requête: Ref<T | undefined>;
    réfRésultat: Ref;
    fRecherche: ({
      requête,
      nOuProfondeur,
      réfRésultat,
    }: {
      requête: T;
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
      if (requête.value) {
        const retour = await fRecherche({
          requête: requête.value,
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

    watch(requête, lancerRecherche);
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
