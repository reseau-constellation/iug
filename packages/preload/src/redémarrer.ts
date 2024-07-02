import {ipcRenderer} from 'electron';

export const redémarrer = async () => {
  return ipcRenderer.invoke('redémarrer');
};
