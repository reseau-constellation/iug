import {computed, ref} from 'vue';
import {defineStore} from 'pinia';
import {v4 as uuidv4} from 'uuid';

export type Info = InfoInstaller | InfoMettreÀJour;
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
  };
};

export const utiliserÉtatInfos = defineStore('Infos', () => {
  const _infos = ref<InfoAvecId[]>([]);
  const infos = computed(() => {
    return _infos.value.sort((a, b) => (a.à > b.à ? 1 : -1));
  });
  const ajouterInfo = (nouv: Info) =>
    (_infos.value = [{id: uuidv4(), info: nouv, lu: false, à: Date.now()}, ...infos.value]);
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
