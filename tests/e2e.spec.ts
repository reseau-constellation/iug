import type {ElectronApplication} from 'playwright';

import {afterAll, beforeAll, expect, test, describe} from 'vitest';

import {changerLangue, constellationPrêt, surÉlectron} from './utils';

describe('Test fenêtre appli', function () {
  let appliÉlectron: ElectronApplication;
  let fermer: () => Promise<void>;
  
  beforeAll(async () => {
    ({appli: appliÉlectron, fermer} = await surÉlectron());
  });
  
  afterAll(async () => {
    await fermer();
  });
  
  test('Main window state', async () => {
    const windowState: {isVisible: boolean; isDevToolsOpened: boolean; isCrashed: boolean} =
      await appliÉlectron.evaluate(async ({BrowserWindow}) => {
        await new Promise<void>(résoudre => {
          const fVérif = () => {
            if (BrowserWindow.getAllWindows().length) {
              clearInterval(intervale);
              résoudre();
            }
          };
          const intervale = setInterval(fVérif, 1000);
          fVérif();
        });
        const mainWindow = BrowserWindow.getAllWindows()[0];
  
        const getState = () => ({
          isVisible: mainWindow.isVisible(),
          isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
          isCrashed: mainWindow.webContents.isCrashed(),
        });
  
        return new Promise(resolve => {
          if (mainWindow.isVisible()) {
            resolve(getState());
          } else mainWindow.once('ready-to-show', () => setTimeout(() => resolve(getState()), 0));
        });
      });
  
    expect(windowState.isCrashed, 'The app has crashed').toBeFalsy();
    expect(windowState.isVisible, 'The main window was not visible').toBeTruthy();
    expect(windowState.isDevToolsOpened, 'The DevTools panel was open').toBeFalsy();
  });
  
  test('Main window web content', async () => {
    const page = await appliÉlectron.firstWindow();
    const element = await page.$('#app', {strict: true});
    expect(element, 'Was unable to find the root element').toBeDefined();
    expect((await element!.innerHTML()).trim(), 'Window content was empty').not.equal('');
  });

  test('Changer langue', async () => {
    const page = await appliÉlectron.firstWindow();
    await changerLangue({page, langue: 'த'});
  });
  
  test('Constellation initialisé', async () => {
    const page = await appliÉlectron.firstWindow();
    await constellationPrêt({page});
  });


  test('Créer compte', async () => {
    const page = await appliÉlectron.firstWindow();
    const btnDémarrer = await constellationPrêt({page});
    console.log('Constellation prêt');
    await btnDémarrer.click();
    console.log('Démarré cliqué');
    const btnNouveau = await page.waitForSelector('.mdi-creation-outline');
    console.log('Btn nouveau compte sélectionné');
    await btnNouveau.click();
    console.log('Btn nouveau compte cliqué');
    
    // Nom utilisatrice
    await page.getByLabel('உங்கள் பெயர்').fill('நான் தான்');
    console.log('Nom écrit');
    await page.keyboard.press('Enter');
    console.log('Nom inscrit');
    
    const btnSuivant = page.getByText('அடுத்தது');
    console.log('Btn suivant');
    await btnSuivant.click();
    console.log('Suivant');
    
    // Image
    await btnSuivant.click();
    console.log('Au suivant');
    
    // Création compte
    const btnCréerCompte = page.getByText('தொடக்கலாம்');
    console.log('Btn création compte');
    
    await btnCréerCompte.click();
    console.log('Btn création compte cliqué');
    
    const menuNavig = await page.waitForSelector('.v-navigation-drawer__content');
    console.log('Navigation');
    await menuNavig.hover();
    console.log('Souris sur navigation');
    
    const nomUtilisatrice = page.getByText('நான் தான்');
    console.log('Nom utilisatrice', nomUtilisatrice);
    expect(await nomUtilisatrice.innerText()).to.equal('நான் தான்');
  });

});

/**
test('Preload versions', async () => {
  const page = await appliÉlectron.firstWindow();
  const renderedVersions = await page.locator('#process-versions').innerText();

  const expectedVersions = await appliÉlectron.evaluate(() => process.versions);

  for (const expectedVersionsKey in expectedVersions) {
    expect(renderedVersions).include(
      `${expectedVersionsKey}: v${expectedVersions[expectedVersionsKey]}`,
    );
  }
});
  
test('Preload nodeCrypto', async () => {
  const page = await electronApp.firstWindow();

  // Test hashing a random string
  const testString = Math.random().toString(36).slice(2, 7);

  await page.fill('input', testString);
  const renderedHash = await page.inputValue('input[readonly]');
  const expectedHash = createHash('sha256').update(testString).digest('hex');
  expect(renderedHash).toEqual(expectedHash);
});
 */
