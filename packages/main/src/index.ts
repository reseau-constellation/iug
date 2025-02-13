import {app} from 'electron';
import {electronAppUniversalProtocolClient} from 'electron-app-universal-protocol-client';
import './security-restrictions';
import {gestionnaireFenêtres} from '/@/constellation';
import {restoreOrCreateWindow} from '/@/mainWindow';

/**
 * Prevent electron from running multiple instances.
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);

/**
 * Disable Hardware Acceleration to save more system resources.
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * Fermer Constellation lorsqu'on a fini
 */
app.on('will-quit', async () => {
  await gestionnaireFenêtres.fermerConstellation();
});

/**
 * @see https://www.electronjs.org/docs/latest/api/app#event-activate-macos Event: 'activate'.
 */
app.on('activate', restoreOrCreateWindow);

/**
 * Create the application window when the background process is ready.
 */
app
  .whenReady()
  .then(restoreOrCreateWindow)
  .catch(e => console.error('Failed create window:', e));

app.whenReady().then(async () => {
  electronAppUniversalProtocolClient.on('request', async requestUrl => {
    // Handle the request

    console.log(requestUrl);
  });

  await electronAppUniversalProtocolClient.initialize({
    protocol: 'constl',
    mode: import.meta.env.DEV ? 'development' : 'production',
  });
});

/**
 * Install Vue.js or any other extension in development mode only.
 * Note: You must install `electron-devtools-installer` manually
 */
// if (import.meta.env.DEV) {
//   app.whenReady()
//     .then(() => import('electron-devtools-installer'))
//     .then(({default: installExtension, VUEJS3_DEVTOOLS}) => installExtension(VUEJS3_DEVTOOLS, {
//       loadExtensionOptions: {
//         allowFileAccess: true,
//       },
//     }))
//     .catch(e => console.error('Failed install extension:', e));
// }

/**
 * Check for new version of the application - production mode only.
 */
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import('electron-updater'))
    .then(({default: {autoUpdater}}) => autoUpdater.checkForUpdatesAndNotify())
    .catch(e => console.error('Erreur vérification mises à jour :', e));
}
