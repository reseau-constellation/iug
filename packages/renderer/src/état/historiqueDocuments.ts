import {defineStore} from 'pinia';

export type OuvertureDocument = {id: string; à: number};

interface ÉtatHistoriqueDocuments {
  récents: OuvertureDocument[];
}

const maxHistorique = 20;

export const utiliserHistoriqueDocuments = defineStore('historiqueDocuments', {
  state: (): ÉtatHistoriqueDocuments => {
    return {
      récents: [],
    };
  },
  actions: {
    documentOuvert({id, à}: {id: string; à: number}) {
      this.récents = [{id, à}, ...this.récents.filter(x => x.id !== id)]
        .sort((a, b) => (a.à > b.à ? -1 : 1))
        .slice(0, maxHistorique);
    },
    effacer({id}: {id: string}) {
      this.récents = [...this.récents.filter(r => r.id !== id)];
    },
  },
  persist: {
    afterHydrate: ctx => {
      console.log('état', ctx.store.$state);
    },
  },
});
