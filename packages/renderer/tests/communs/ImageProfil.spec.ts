import type {Constellation} from '@constl/ipa';

import {mount} from '@vue/test-utils';
import {expect, test, vi} from 'vitest';

import ImageProfil from '../../src/components/communs/ImageProfil.vue';

import vuetify from '../../src/plugins/vuetify';
import {attendreQue, fausseConstellation} from '../utils';
import {createPinia} from 'pinia';

const constl = fausseConstellation(client => {
  client.prototype.profil = {
    suivreImage: vi.fn(async ({f, idCompte}) => {
      f(idCompte ? new Uint8Array([0, 1, 2]) : null);
      return async () => {};
    }),
  } as unknown as Constellation['profil'];
});

const mountFunction = (composante, options?: Record<string, unknown>) => {
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
  await attendreQue(() => !!enveloppe.find('img'));
  const élImage = enveloppe.find('img');

  expect(élImage.attributes()['src']).toContain('svg');
});

test('Composante ImageProfil - avec id compte', async () => {
  expect(ImageProfil).toBeTruthy();

  const enveloppe = mountFunction(ImageProfil, {
    props: {id: 'compte test'},
  });

  await attendreQue(
    () =>
      enveloppe.find('img').exists() && enveloppe.find('img').attributes()['src'].includes('blob'),
  );
  const élImage = enveloppe.find('img');

  expect(élImage.attributes()['src']).toContain('blob');
});
