import {defineStore} from 'pinia';

interface ÉtatHistoriqueDocuments {
  historique: {[clef: string]: {[à: string]: number}};
}

const résoudreTemps = ({
  à,
  résolution,
}: {
  à: Date;
  résolution: 'heure' | 'jour' | 'mois' | 'année';
}): Date => {
  switch (résolution) {
    case 'heure':
      return new Date(à.getFullYear(), à.getMonth(), à.getDate(), à.getHours());

    case 'jour':
      return new Date(à.getFullYear(), à.getMonth(), à.getDate());

    case 'mois':
      return new Date(à.getFullYear(), à.getMonth());

    case 'année':
      return new Date(à.getFullYear(), 0);

    default:
      throw new Error(résolution);
  }
};

export const utiliserHistorique = ({
  résolution = 'jour',
}: {
  résolution?: 'heure' | 'jour' | 'mois' | 'année';
}) =>
  defineStore('historique', {
    state: (): ÉtatHistoriqueDocuments => {
      return {
        historique: {},
      };
    },
    actions: {
      observer({clef, val}: {clef: string; val?: number}) {
        if (val === undefined) return;
        if (this.historique[clef]) {
          // Pas besoin de sauvegarder si la valeur n'a pas changé depuis la dernière fois
          const plusRécente = Math.max(...Object.keys(this.historique[clef]).map(parseInt));
          if (val === this.historique[clef][plusRécente]) return;
        }
        if (!this.historique[clef]) this.historique[clef] = {};
        const temps = résoudreTemps({à: new Date(), résolution}).getTime();
        this.historique[clef][temps] = val;
      },
    },
    getters: {
      obtHistorique(état) {
        return (clef: string) =>
          Object.entries(état.historique[clef] || {}).map(([date, val]) => ({date, val}));
      },
    },
    persist: {
      afterHydrate: () => {},
    },
  })();
