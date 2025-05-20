import type {Constellation} from '@constl/ipa';

import {mount} from '@vue/test-utils';
import {expect, test, vi} from 'vitest';

import ImageProfil from '../../src/components/communs/ImageProfil.vue';

import {createPinia} from 'pinia';
import vuetify from '../../src/plugins/vuetify';
import {fausseConstellation, substitionsJSDOM} from '../utils';

const constl = fausseConstellation(client => {
  client.prototype.profil = {
    suivreImage: vi.fn(async ({f, idCompte}) => {
      f(idCompte ? {image: new Uint8Array(Array(100)), idImage: 'mon image.png'} : null);
      return async () => {};
    }),
  } as unknown as Constellation['profil'];
});

const mountFunction = (composante, options?: Record<string, unknown>) => {
  substitionsJSDOM();
  return mount(composante, {
    ...options,
    global: {
      plugins: [vuetify, constl, createPinia()],
    },
  });
};

test('Composante ImageProfil - sans id compte', async () => {
  expect(ImageProfil).toBeTruthy();

  const enveloppe = mountFunction(ImageProfil, {
    props: {},
  });
  await enveloppe.vm.$nextTick();
  const élImage = enveloppe.find('img');

  expect(élImage.attributes()['src']).toContain('svg');
});

test('Composante ImageProfil - avec id compte', async () => {
  expect(ImageProfil).toBeTruthy();

  const enveloppe = mountFunction(ImageProfil, {
    props: {id: 'compte test'},
  });

  await enveloppe.vm.$nextTick();
  const élImage = enveloppe.find('img');

  expect(élImage.attributes()['src']).toContain('blob');
});
