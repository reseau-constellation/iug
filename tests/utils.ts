import type {ElectronApplication, Page} from 'playwright';
import {_electron as electron} from 'playwright';

import {dossiers} from '@constl/utils-tests';
import {Nuchabäl} from 'nuchabal';

const nuchabäl = new Nuchabäl({});

export const surÉlectron = async (): Promise<{
  appli: ElectronApplication;
  fermer: () => Promise<void>;
}> => {
  // Utiliser un dossier temporaire pour le compte Constellation dans les tests
  const {
    dossier, 
    fEffacer,
  } = await dossiers.dossierTempo();

  const appli = await electron.launch({args: ['.'], env: {...process.env, DOSSIER_CONSTL: dossier}});

  const fermer = async () => {
    try {
      await appli.close();
    } finally {
      fEffacer?.();
    }
  };

  return {appli, fermer};
};

export const surNavig = () => {};

export const constellationPrêt = async ({page}: {page: Page}) => {
  return await page.waitForSelector('.v-btn--variant-outlined');
};

export const changerLangue = async ({page, langue}: {page: Page; langue: string}) => {
  const nomLangue = nuchabäl.rubiChabäl({runuk: langue});
  const btnLangues = await page.waitForSelector('.mdi-earth');
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
