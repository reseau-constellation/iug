import {defineStore} from 'pinia';
import {v4 as uuidv4} from 'uuid';
import {computed, ref} from 'vue';

export type Info = InfoInstaller | InfoMettreÀJour | InfoProtégerDonnnées | InfoUtilisationMémoire;
export type InfoAvecId<T extends Info = Info> = {
  id: string;
  lu: boolean;
  info: T;
  à: number;
};

export type InfoInstaller = {
  type: 'installer';
};

export type InfoMettreÀJour = {
  type: 'mettreÀJour';
  détails: {
    dernièreVersionDisponible: string;
    versionActuelle: string;
    urlTéléchargement: string;
  };
};

export type InfoProtégerDonnnées = {
  type: 'protégerDonnées';
};

export type InfoUtilisationMémoire = {
  type: 'utilisationMémoire';
  détails: {
    quota: number;
    utilisation: number;
  };
};

export const utiliserÉtatInfos = defineStore('Infos', () => {
  const _infos = ref<InfoAvecId[]>([]);
  const infos = computed(() => {
    return _infos.value.sort((a, b) => (a.à > b.à ? 1 : -1));
  });
  const ajouterInfo = (nouv: Info, clef?: string) => {
    const id = clef || uuidv4();
    _infos.value = [
      {id, info: nouv, lu: false, à: Date.now()},
      ...infos.value.filter(info => info.id !== id),
    ];
    return id;
  };
  const lireInfo = (idInfo: string) => {
    const info = _infos.value.find(i => i.id === idInfo);
    if (!info) throw new Error(`Info avec id ${idInfo} introuvable.`);
    _infos.value = [{...info, lu: true}, ...infos.value.filter(n => n.id !== idInfo)];
  };
  const effacerInfo = (idInfo: string) => (_infos.value = infos.value.filter(n => n.id !== idInfo));
  return {
    infos,
    ajouterInfo,
    lireInfo,
    effacerInfo,
  };
});
