import {ipcRenderer} from 'electron';

export const demanderAccèsMédia = async (
  média: 'microphone' | 'camera',
): Promise<boolean | undefined> => {
  return ipcRenderer.invoke('demanderAccèsMédia', média);
};
