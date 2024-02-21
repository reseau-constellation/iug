import {mount} from '@vue/test-utils';
import {expect, test} from 'vitest';

import ImageProfil from '../../src/components/communs/ImageProfil.vue';

import vuetify from '../../src/plugins/vuetify';
import {attendreQue, constellationTest} from '../utils';
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
  expect(ImageProfil).toBeTruthy();

  const enveloppe = mountFunction(ImageProfil, {
    props: { },
  });
  await attendreQue(() => !!enveloppe.find('img'));
  const élImage = enveloppe.find('img');

  expect(élImage.attributes()['src']).toContain('svg');
});
