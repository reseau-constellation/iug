import {defineStore} from 'pinia';
import {useTheme} from 'vuetify';

interface ÉtatThème {
  couleur: string;
  thèmeImages: string;
  langue: string[];
  numération?: string;
}

const changerThèmeVuetify = (nouvelleThème: string) => {
  const thème = useTheme();
  thème.global.name.value = nouvelleThème;
};

export const utiliserÉtatThème = defineStore('thème', {
  state: (): ÉtatThème => {
    return {
      couleur: 'light',
      thèmeImages: 'வவவ',
      langue: [],
    };
  },
  persist: {
    afterRestore: ctx => {
      changerThèmeVuetify(ctx.store.$state.couleur);
    },
  },
});
