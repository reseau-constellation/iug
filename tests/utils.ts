import type {Browser, ElectronApplication, Page} from 'playwright';
import {_electron as electron, chromium, webkit, firefox } from 'playwright';

import {dossiers} from '@constl/utils-tests';
import {Nuchabäl} from 'nuchabal';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const nuchabäl = new Nuchabäl({});

export const surÉlectron = async (): Promise<{
  appli: ElectronApplication;
  page: Page;
  fermer: () => Promise<void>;
}> => {
  // Utiliser un dossier temporaire pour le compte Constellation dans les tests
  const {
    dossier, 
    fEffacer,
  } = await dossiers.dossierTempo();

  // Inclure {...process.env} est nécessaire pour les tests sur Linux
  const appli = await electron.launch({args: ['.'], env: {...process.env, DOSSIER_CONSTL: dossier}});
  const page = await appli.firstWindow();

  const fermer = async () => {
    try {
      await appli.close();
    } finally {
      fEffacer?.();
    }
  };

  return {appli, page, fermer};
};

export const surNavig = async ({typeNavigateur}: {typeNavigateur: 'webkit' | 'chromium' | 'firefox'}): Promise<{
  page: Page;
  fermer: () => Promise<void>;
}> => {
  let navigateur: Browser;
  switch (typeNavigateur) {
    case 'chromium':
      navigateur = await chromium.launch({
        args: ['--disable-web-security'],
      });
      break;
    case 'firefox':
      navigateur = await firefox.launch();
      break;
    case 'webkit':
      navigateur = await webkit.launch({
        args: ['--disable-web-security'],
      });
      break;
    default:
      throw new Error(typeNavigateur);
  }

  const page = await navigateur.newPage();
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const fichierHtml = path.join(__dirname, '..', 'packages', 'renderer', 'dist', 'web', 'index.html');
  
  await page.goto(`file://${fichierHtml}`);

  const fermer = async () => {
    await page.close();
    await navigateur.close();
  };

  return {page, fermer};
};

export const constellationPrêt = async ({page}: {page: Page}) => {
  return await page.waitForSelector('.v-btn--variant-outlined');
};

export const changerLangue = async ({page, langue}: {page: Page; langue: string}) => {
  const nomLangue = nuchabäl.rubiChabäl({runuk: langue});
  console.log('ici 1');
  const btnLangues = await page.waitForSelector('.mdi-earth');
  console.log('ici 2');
  await btnLangues.click();

  if (nomLangue) {
    // Donner 3 secondes maximum (si la langue n'est pas encore disponible, on ne la trouvera pas)
    await new Promise<void>(résoudre => {
      const chrono = setTimeout(résoudre, 3000);
      page
        .getByText(nomLangue)
        .click()
        .then(() => {
          clearTimeout(chrono);
          résoudre();
        });
    });

    // Attendre que le menu disparaisse
    await page.waitForSelector('.v-list', {state: 'hidden'});
  }
};
