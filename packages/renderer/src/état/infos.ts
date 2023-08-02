import {ref} from 'vue';
import {defineStore} from 'pinia';
import {v4 as uuidv4} from 'uuid';

export type Info = InfoInstaller | InfoMettreÀJour;
export type InfoAvecId<T extends Info = Info> = {
  id: string;
  info: T;
};

export type InfoInstaller = {
  type: 'installer';
};

export type InfoMettreÀJour = {
  type: 'mettreÀJour';
  détails: {
    dernièreVersionDisponible: string;
    versionActuelle: string;
  };
};

export const utiliserÉtatInfos = defineStore('Infos', () => {
  const infos = ref<InfoAvecId[]>([]);
  const ajouterInfo = (nouv: Info) => (infos.value = [{id: uuidv4(), info: nouv}, ...infos.value]);
  const effacerInfo = (idInfo: string) => (infos.value = infos.value.filter(n => n.id !== idInfo));
  return {
    infos,
    ajouterInfo,
    effacerInfo,
  };
});
