import {type IpcMainInvokeEvent, dialog, ipcMain} from 'electron';
import mergeOptions from 'merge-options';
const choisirDossier = async (_événement: IpcMainInvokeEvent): Promise<string | undefined> => {
  return (
    await dialog.showOpenDialog({
      properties: ['openDirectory', 'promptToCreate'],
    })
  ).filePaths[0];
};

const choisirFichierSauvegarde = async (
  _événement: IpcMainInvokeEvent,
  ...args: [Parameters<typeof dialog.showSaveDialog>]
): Promise<string | undefined> => {
  const argsDéfaut: Parameters<typeof dialog.showSaveDialog>[0] = {
    properties: ['createDirectory', 'showOverwriteConfirmation'],
  };

  const {canceled, filePath} = await dialog.showSaveDialog(mergeOptions(argsDéfaut, args[0] || {}));
  if (!canceled) return filePath;
};

export const connecterSystèmeFichiers = () => {
  ipcMain.handle('choisirDossier', choisirDossier);
  ipcMain.handle('choisirFichierSauvegarde', choisirFichierSauvegarde);
};
