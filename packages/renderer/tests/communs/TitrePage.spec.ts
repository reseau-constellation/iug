import {mount} from '@vue/test-utils';
import {expect, test} from 'vitest';
import TitrePage from '../../src/components/communs/TitrePage.vue';
import vuetify from '../../src/plugins/vuetify';

const mountFunction = (composante, options?: Record<string, unknown>) => {
  return mount(composante, {
    ...options,
    global: {
      plugins: [vuetify],
    },
  });
};

test('Composante TitrePage - titre', async () => {
  expect(TitrePage).toBeTruthy();

  const titre = 'Mon titre de page';
  const wrapper = mountFunction(TitrePage, {
    props: { titre },
  });

  const élTitre = wrapper.get('h1');

  expect(élTitre.text()).toBe(titre);
});

test('Composante TitrePage - sousTitre', async () => {
  expect(TitrePage).toBeTruthy();
  
  const titre = 'Mon titre de page';
  const sousTitre = 'Mon sous-titre de page';
  const wrapper = mountFunction(TitrePage, {
    props: { titre, sousTitre },
  });

  const élSousTitre = wrapper.get('h2');

  expect(élSousTitre.text()).toBe(sousTitre);
});


test('Composante TitrePage - image', async () => {
  expect(TitrePage).toBeTruthy();
  
  const titre = 'Mon titre de page';
  const image = 'urlImage.png';
  const wrapper = mountFunction(TitrePage, {
    props: { titre, image },
  });

  const élSousTitre = wrapper.get('img');

  expect(élSousTitre.attributes()['src']).toBe(image);
});
