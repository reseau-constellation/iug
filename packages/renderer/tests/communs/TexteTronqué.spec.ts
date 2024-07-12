import கிளிமூக்கை_உருவாக்கு from '@lassi-js/kilimukku-vue';
import {mount} from '@vue/test-utils';
import {expect, test} from 'vitest';
import TexteTronqué from '../../src/components/communs/TexteTronqué.vue';
import vuetify from '../../src/plugins/vuetify';
import {attendreQue} from '../utils';

const mountFunction = (composante, options?: Record<string, unknown>) => {
  return mount(composante, {
    ...options,
    global: {
      plugins: [
        vuetify,
        கிளிமூக்கை_உருவாக்கு({
          மொழி: 'த',
          மூல்_மொழிபெயர்ப்புகள்: {
            fr: {
              communs: {
                troisPetitsPoints: '...',
              },
            },
          },
        }),
      ],
    },
  });
};

test('Composante TexteTronqué - texte assez court', async () => {
  expect(TexteTronqué).toBeTruthy();

  const texte = 'Texte assez court';
  const longueurMax = 20;
  const enveloppe = mountFunction(TexteTronqué, {
    props: {texte, longueurMax},
  });

  const élTexte = enveloppe.get('span');

  expect(élTexte.text()).toBe(texte);
});

test('Composante TexteTronqué - texte un peu trop long', async () => {
  expect(TexteTronqué).toBeTruthy();

  const texte = 'Texte trop long';
  const longueurMax = 13;
  const enveloppe = mountFunction(TexteTronqué, {
    props: {texte, longueurMax},
  });

  const élTexte = enveloppe.get('span');
  await attendreQue(() => !élTexte.text().endsWith('troisPetitsPoints'));

  expect(élTexte.text()).toBe('Texte trop...');
});

test('Composante TexteTronqué - texte beaucoup trop long', async () => {
  expect(TexteTronqué).toBeTruthy();

  const texte = 'Texte beaucoup trop long';
  const longueurMax = 13;
  const enveloppe = mountFunction(TexteTronqué, {
    props: {texte, longueurMax},
  });

  const élTexte = enveloppe.get('span');
  await attendreQue(() => !élTexte.text().endsWith('troisPetitsPoints'));

  expect(élTexte.text()).toBe('Texte beau...');
});

test('Composante TexteTronqué - unicode', async () => {
  expect(TexteTronqué).toBeTruthy();

  const texte = 'இந்த உரை மிக்க நீலமானது';
  const longueurMax = 16;
  const enveloppe = mountFunction(TexteTronqué, {
    props: {texte, longueurMax},
  });

  const élTexte = enveloppe.get('span');
  await attendreQue(() => !élTexte.text().endsWith('troisPetitsPoints'));

  expect(élTexte.text()).toBe('இந்த உரை மிக்...');
});
