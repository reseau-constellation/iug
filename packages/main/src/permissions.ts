import { systemPreferences, ipcMain, type IpcMainInvokeEvent } from 'electron';



export const demanderAccèsMédia = async (_événement: IpcMainInvokeEvent, média: 'microphone' | 'camera') => {
  return await systemPreferences.askForMediaAccess(média);
};

export const connecterDemanderAccèsMédia = () => {
    ipcMain.handle('demanderAccèsMédia', demanderAccèsMédia);
};
