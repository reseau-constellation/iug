import {app, ipcMain} from 'electron';

const redémarrer = () => {
  app.relaunch();
  app.quit();
};

export const connecterRedémarrer = () => {
  ipcMain.handle('redémarrer', redémarrer);
};
