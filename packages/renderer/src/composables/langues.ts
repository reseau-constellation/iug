import {computed, inject, onUnmounted, ref, watchEffect} from 'vue';
import {useI18n} from 'vue-i18n';

import {Nuchabäl} from 'nuchabal';

import type {Ref} from 'vue';
import type {கிளிமூக்கு} from '../plugins/kilimukku/கிளிமூக்கு';
import type {schémaFonctionOublier} from '@constl/ipa/dist/utils';

const nuchabäl = new Nuchabäl({});

const utiliserCodesLanguesDisponibles = (): Ref<string[]> => {
  const fsOublier: (schémaFonctionOublier | (() => void))[] = [];

  const kilimukku = inject<கிளிமூக்கு>('கிளிமூக்கு');

  const codesLanguesKilimukku = ref<string[]>([]);
  if (kilimukku) {
    kilimukku
      .மொழிகளை_கேள்ளு({
        செ: மொழிகள் => (codesLanguesKilimukku.value = மொழிகள்),
        பரிந்துரைகளும்: true,
      })
      .then(f => fsOublier.push(f));
  }

  const codesLanguesNuchabäl = ref<string[]>([]);

  const fOublierCodesLanguesNuchabäl = nuchabäl.tatzeqelbejKonojelChabäl({
    sm: codes => (codesLanguesNuchabäl.value = codes),
  });
  fsOublier.push(fOublierCodesLanguesNuchabäl);

  onUnmounted(async () => {
    await Promise.all(fsOublier.map(f => f()));
  });

  return computed(() => {
    return [...new Set([...codesLanguesNuchabäl.value, ...codesLanguesKilimukku.value])];
  });
};

const utiliserListeLanguesEtCodes = (): Ref<{lng?: string; code: string}[]> => {
  const codesLanguesDisponibles = utiliserCodesLanguesDisponibles();

  const langesEtCodes = computed<{lng?: string; code: string}[]>(() => {
    // On a pas besoin de lier les noms de langues de manière réactive parce que tatzeqelbejKonojelChabäl détectera
    // tout changement aux noms de langues, pas juste à leurs codes.
    return codesLanguesDisponibles.value
      .map(code => {
        return {
          code,
          lng: nuchabäl.rubiChabäl({runuk: code}),
        };
      })
      .filter(x => x.lng) as {lng: string; code: string}[];
  });

  return langesEtCodes;
};

const utiliserNomLangue = (code: string): Ref<string | undefined> => {
  const languesEtCode = utiliserListeLanguesEtCodes();
  return computed(() => {
    return languesEtCode.value.find(x => x.code === code)?.lng;
  });
};

const utiliserLangueSélectionnée = (): Ref<string> => {
  const {locale} = useI18n();
  watchEffect(() => {
    // Vuetify
    // const clefLangueVuetify = locale.value;
    // const {current} = useLocale();
    // current.value = clefLangueVuetify;
  });
  return locale;
};

export const utiliserLangues = function () {
  return {
    utiliserLangueSélectionnée,
    utiliserCodesLanguesDisponibles,
    utiliserListeLanguesEtCodes,
    utiliserNomLangue,
  };
};
