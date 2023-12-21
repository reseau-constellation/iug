import {defineStore} from 'pinia';

interface ÉtatHistoriqueDocuments {
  historique: {[clef: string]: {[à: string]: number}};
}

const résoudreTemps = ({à, résolution}:{à: Date, résolution: 'heure' | 'jour' | 'mois' | 'année'}): string => {
  switch (résolution) {
    case 'heure':
      return `${à.getDate()}.${à.getMonth()}.${à.getFullYear()}.${à.getHours()}`;

      case 'jour':
      return `${à.getDate()}.${à.getMonth()}.${à.getFullYear()}`;

    case 'mois':
      return `${à.getMonth()}.${à.getFullYear()}`;

    case 'année':
      return `${à.getFullYear()}`;

    default:
      throw new Error(résolution);
  }
};

export const utiliserHistorique = ({résolution='jour'}: {résolution?: 'heure' | 'jour' | 'mois' | 'année'}) => defineStore('historique', {
  state: (): ÉtatHistoriqueDocuments => {
    return {
      historique: {},
    };
  },
  actions: {
    observer({clef, val}: {clef: string; val?: number}) {
      if (val === undefined) return;
      if (!this.historique[clef]) this.historique[clef] = {};
      const temps = résoudreTemps({à: new Date(), résolution});
      this.historique[clef][temps] = val;
    },
  },
  getters: {
    obtHistorique(état) {
      return (clef: string) => état.historique[clef];
    },
  },
  persist: {
    afterRestore: ()=>{},
  },
})();
