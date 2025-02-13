import {ipcRenderer} from 'electron';
import type {dialog} from 'electron';

export const choisirDossier = async (): Promise<string | undefined> => {
  return ipcRenderer.invoke('choisirDossier');
};

export const choisirFichierSauvegarde = async (options: Parameters<typeof dialog.showSaveDialog>[0] = {}): Promise<string | undefined> => {
  return ipcRenderer.invoke('choisirFichierSauvegarde', options);
};
