import type ClientConstellation from '@constl/ipa';
import type {App, Ref, ComputedRef} from 'vue';
import {onUnmounted} from 'vue';
import Cookies from 'js-cookie';
import {Nuchabäl} from 'nuchabal';
import {எண்ணிக்கை} from 'ennikkai';

import {computed, inject, ref, watchEffect} from 'vue';

const créerNuchabäl = ({constellation}: {constellation?: ClientConstellation}): Nuchabäl => {
  return new Nuchabäl({chumil: constellation});
};

const créerEnnikai = ({constellation}: {constellation?: ClientConstellation}): எண்ணிக்கை => {
  return new எண்ணிக்கை({விண்மீன்: constellation});
};

const créerLocales = ({
  langue,
  languesAlternatives = [],
}: {
  langue: string;
  languesAlternatives?: string[];
}) => {
  const témoin = Cookies.get('paramètres.langue');
  let sauvegardées: string[] | undefined = undefined;
  try {
    sauvegardées = témoin ? JSON.parse(témoin) : undefined;
  } catch {
    // c'est pas grave
  }
  const langueEtAlternatives = ref<string[]>(
    Array.isArray(sauvegardées) ? sauvegardées : [langue, ...languesAlternatives],
  );

  const sélectionNumération = ref<string>();

  return {
    langueEtAlternatives,
    sélectionNumération,
  };
};

export const utiliserLangues = () => {
  const locales = inject<{
    nuchabäl: Nuchabäl;
    எண்ணிக்கை: எண்ணிக்கை;
    locales: ReturnType<typeof créerLocales>;
  }>('locales');
  if (!locales) throw new Error('Locales non installées');
  const langueEtAlternatives = locales.locales.langueEtAlternatives;
  const langue = computed(() => langueEtAlternatives.value[0]);
  const languesAlternatives = computed(() => langueEtAlternatives.value.slice(1));

  const choisirLangues = (lngs: string | string[]) => {
    if (Array.isArray(lngs)) {
      if (lngs.length) {
        langueEtAlternatives.value = lngs;
      }
    } else {
      langueEtAlternatives.value = [lngs, ...langueEtAlternatives.value.filter(l => l !== lngs)];
    }
    Cookies.set('paramètres.langue', JSON.stringify(langueEtAlternatives.value));
  };

  const traduireNom = (noms: Ref<{[lng: string]: string}>): ComputedRef<string | undefined> => {
    const locales = inject<{
      nuchabäl: Nuchabäl;
      எண்ணிக்கை: எண்ணிக்கை;
      locales: ReturnType<typeof créerLocales>;
    }>('locales');
    const nuchabäl = locales?.nuchabäl;
    return computed(() => {
      for (const lng of langueEtAlternatives.value) {
        if (noms.value[lng]) return noms.value[lng];
      }
      const écritureLanguePréférée = nuchabäl?.rutzibChabäl({runuk: langueEtAlternatives.value[0]});
      for (const lng of langueEtAlternatives.value) {
        if (
          écritureLanguePréférée &&
          écritureLanguePréférée === nuchabäl?.rutzibChabäl({runuk: lng})
        )
          return noms.value[lng];
      }
      return Object.values(noms.value)[0];
    });
  };

  return {
    langue,
    languesAlternatives,
    choisirLangues,
    traduireNom,
  };
};

export const utiliserNumération = () => {
  const locales = inject<{
    nuchabäl: Nuchabäl;
    எண்ணிக்கை: எண்ணிக்கை;
    locales: ReturnType<typeof créerLocales>;
  }>('locales');
  if (!locales) throw new Error('Locales non installées');
  const nuchabäl = locales['nuchabäl'];
  const ennikkai = locales.எண்ணிக்கை;

  const {langue} = utiliserLangues();

  const numérationAuto = ref(nuchabäl.rajilanïkChabäl({runuk: langue.value}));
  let fOublier: (() => void) | undefined;

  watchEffect(() => {
    if (fOublier) fOublier();
    fOublier = nuchabäl?.tatzeqelbejRajilanïkChabäl({
      runuk: langue.value,
      sm: (nm?: string) => (numérationAuto.value = nm),
    });
  });

  onUnmounted(() => {
    if (fOublier) fOublier();
  });

  const numération = computed<string>(() => {
    return locales.locales.sélectionNumération.value || numérationAuto.value || 'latin';
  });

  if (nuchabäl) {
    let fOublierNumérationNuchabäl: (() => void) | undefined;
    watchEffect(() => {
      fOublierNumérationNuchabäl = nuchabäl.tatzeqelbejRajilanïkChabäl({
        runuk: langue.value,
        sm: (num?: string) => (numérationAuto.value = num),
      });
    });
    onUnmounted(() => {
      if (fOublierNumérationNuchabäl) fOublierNumérationNuchabäl();
    });
  }

  const formatterChiffre = (chiffre: number | Ref<number>): Ref<string> => {
    const chiffreFormatté = computed<string>(() =>
      ennikkai.உரைக்கு({
        எண்: typeof chiffre === 'number' ? chiffre : chiffre.value,
        மொழி: numération.value,
      }),
    );
    return chiffreFormatté;
  };

  const formatterVersion = (version: string): Ref<string | undefined> => {
    const versionTraduite = computed(() => {
      return numération.value
        ? version
            .split('.')
            .map(n => ennikkai.உரைக்கு({எண்: parseInt(n), மொழி: numération.value}))
            .join('.') // பிரிப்பு[0]
        : undefined;
    });

    return versionTraduite;
  };

  return {
    numération,
    sélectionNumération: locales?.locales.sélectionNumération,
    formatterChiffre,
    formatterVersion,
  };
};

export default ({
  langue,
  languesAlternatives = [],
}: {
  langue: string;
  languesAlternatives?: string[];
}) => {
  return {
    install: (appli: App) => {
      const constellation = appli.config.globalProperties.$constl;
      const nuchabäl = créerNuchabäl({constellation});
      const ennikkai = créerEnnikai({constellation});
      appli.provide('locales', {
        nuchabäl: nuchabäl,
        எண்ணிக்கை: ennikkai,
        locales: créerLocales({
          langue,
          languesAlternatives,
        }),
      });
    },
  };
};
