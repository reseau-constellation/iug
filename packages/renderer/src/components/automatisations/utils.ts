import { useNow } from '@vueuse/core';
import { type ComputedRef, computed, type MaybeRef, unref } from 'vue';

export type UnitésTemps = 'années' | 'mois' | 'semaines' | 'jours' | 'heures' | 'minutes' | 'secondes' | 'millisecondes';
export const utiliserDifTemps = (): (x: MaybeRef<number|undefined>) => ComputedRef<{n: number, unité: UnitésTemps}|undefined> => {
  // Chronomètre
  const maintenant = useNow();
  return (à: MaybeRef<number|undefined>) => {
    const valÀ = unref(à);
    const difTempsBrute = computed(() => {
      return valÀ ? maintenant.value.getTime() - valÀ : undefined;
    });

    const difTemps = computed((): {n: number, unité: UnitésTemps}|undefined=>{
      if (difTempsBrute.value === undefined) {
        return undefined;
      } else {
        const absDifTemps = Math.abs(difTempsBrute.value);
        const signe = difTempsBrute.value < 0 ? -1 : 1;

        if (absDifTemps < 1000) {
          // < 1 seconde
          return {unité: 'millisecondes', n: absDifTemps * signe};
        }else if (absDifTemps < 1000 * 60) {
          // < 1 minute
          return {unité: 'secondes', n: Math.floor(absDifTemps / 1000) * signe};
        } else if (absDifTemps < 1000 * 60 * 60) {
          // < 1 heure
          return {unité: 'minutes', n: Math.floor(absDifTemps / (1000 * 60)) * signe};
        } else if (absDifTemps < 1000 * 60 * 60 * 24) {
          // < 1 jour
          return {unité: 'heures', n: Math.floor(absDifTemps / (1000 * 60 * 60)) * signe};
        } else if (absDifTemps < 1000 * 60 * 60 * 24 * 7) {
          // < 1 semaine
          return {unité: 'jours', n: Math.floor(absDifTemps / (1000 * 60 * 60 * 24)) * signe};
        } else if (absDifTemps < 1000 * 60 * 60 * 24 * 30) {
          // < 1 mois
          return {unité:'semaines', n: Math.floor(absDifTemps / (1000 * 60 * 60 * 24 * 7)) * signe};
        } else if (absDifTemps < 1000 * 60 * 60 * 24 * 365.25) {
          // < 1 an
          return {unité: 'mois', n: Math.floor(absDifTemps / (1000 * 60 * 60 * 24 * 30)) * signe};
        }
        return {unité: 'années', n: Math.floor(absDifTemps / (1000 * 60 * 60 * 24 * 365.25)) * signe};
      } 
    });

    return difTemps;
  };
};

export const utiliserDans = ({
    t,
    clefs = {
      dans: {
        millisecondes: 'communs.temps.dans.ms',
        secondes: 'communs.temps.dans.secondes',
        minutes: 'communs.temps.dans.minutes',
        heures: 'communs.temps.dans.heures',
        jours: 'communs.temps.dans.jours',
        semaines: 'communs.temps.dans.semaines',
        mois: 'communs.temps.dans.mois',
        années: 'communs.temps.dans.années',
      },
      depuis: {
        millisecondes: 'communs.temps.depuis.ms',
        secondes: 'communs.temps.depuis.secondes',
        minutes: 'communs.temps.depuis.minutes',
        heures: 'communs.temps.depuis.heures',
        jours: 'communs.temps.depuis.jours',
        semaines: 'communs.temps.depuis.semaines',
        mois: 'communs.temps.depuis.mois',
        années: 'communs.temps.depuis.années',
      },
    },
  }: {
    t: (
      clef: string,
      interpol?: {[clef: string]: unknown} | number | unknown[],
      n?: number,
    ) => string;
    clefs?: {
      dans: {
        millisecondes: string;
        secondes: string;
        minutes: string;
        heures: string;
        jours: string;
        semaines: string;
        mois: string;
        années: string;
      };
      depuis: {
        millisecondes: string;
        secondes: string;
        minutes: string;
        heures: string;
        jours: string;
        semaines: string;
        mois: string;
        années: string;
      }
    };
  }): (à: ComputedRef<number|undefined>) => ComputedRef<string|undefined> => {
    const générerDif = utiliserDifTemps();
    return (à: ComputedRef<number|undefined>) => {
      const dif = générerDif(à);
      return computed((): string |undefined =>{
        if (!dif.value) return undefined;
        return t(clefs[dif.value.n < 0 ? 'dans': 'depuis'][dif.value.unité], {n: Math.abs(dif.value.n)});
      });
    };
  };