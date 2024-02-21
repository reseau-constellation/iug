import {mount} from '@vue/test-utils';
import {expect, test} from 'vitest';

import ImageProfil from '../../src/components/communs/ImageProfil.vue';

import vuetify from '../../src/plugins/vuetify';
import {constellationTest} from '../utils';
import {createPinia} from 'pinia';

const mountFunction = (composante, options?: Record<string, unknown>) => {
  return mount(composante, {
    ...options,
    global: {
      plugins: [vuetify, constellationTest, createPinia()],
    },
  });
};

test('Composante ImageProfil - sans id compte', async () => {
  console.log('ici');
  expect(ImageProfil).toBeTruthy();
  console.log('là');
  const enveloppe = mountFunction(ImageProfil, {
    props: {},
  });

  const élImage = enveloppe.get('img');

  expect(élImage.text()).toBe('');
});

test('Composante TitrePage - sousTitre', async () => {
  expect(ImageProfil).toBeTruthy();

  const titre = 'Mon titre de page';
  const sousTitre = 'Mon sous-titre de page';
  const enveloppe = mountFunction(ImageProfil, {
    props: {titre, sousTitre},
  });

  const élSousTitre = enveloppe.get('h2');

  expect(élSousTitre.text()).toBe(sousTitre);
});

test('Composante TitrePage - image', async () => {
  expect(ImageProfil).toBeTruthy();

  // const titre = 'Mon titre de page';
  const image = 'urlImage.png';
  const enveloppe = mountFunction(ImageProfil, {
    props: {},
  });

  const élSousTitre = enveloppe.get('img');

  expect(élSousTitre.attributes()['src']).toBe(image);
});
