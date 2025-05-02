import {suivre} from '@constl/vue';
import type {ComputedRef, MaybeRef, Ref} from 'vue';
import {computed, isRef, onMounted, onUnmounted, ref, unref} from 'vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '../utils';

export const utiliserIcôneContact = ({type}: {type: MaybeRef<string>}): ComputedRef<string> => {
  const réfType = isRef(type) ? type : ref(type);
  return computed(()=> obtIcôneContact({type: réfType.value}));
};

export const obtIcôneContact = ({type}: {type: string}): string => {
  switch (type) {
    case 'siteInternet':
      return 'mdi-open-in-new';
    case 'whatsapp':
      return 'mdi-whatsapp';
    case 'téléphone':
      return 'mdi-phone';
    case 'télégramme':
      return 'mdi-send';
    case 'courriel':
      return 'mdi-email-outline';
    default:
      return 'mdi-account-outline';
  }
};

export const utiliserNomEtTypeDispositif = ({
  idDispositif,
  idCompte,
}: {
  idDispositif: string | Ref<string | undefined>;
  idCompte?: string | Ref<string | undefined>;
}): {nomDispositif: Ref<string | undefined>; typeDispositif: Ref<string | undefined>} => {
  const constl = utiliserConstellation();
  const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
  const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

  const monCompte = suivre(constl.suivreIdCompte);

  const nomEtType = suivre(
    // @ts-expect-error Je ne sais pas comment régler ça...
    constl.suivreNomDispositif,
    {
      idCompte: computed(() => unref(idCompte) || monCompte.value),
      idDispositif,
    },
  );

  const nomDispositif = computed(() => {
    if (!nomEtType.value) return undefined;
    const {nom, type} = nomEtType.value;
    return nom || (type ? t(nomGénériqueTypeDispositif(type)) : undefined);
  });
  const typeDispositif = computed(() => {
    return nomEtType.value?.['type'];
  });

  return {nomDispositif, typeDispositif};
};

export const nomGénériqueTypeDispositif = (typeDispositif: string) => {
  switch (typeDispositif) {
    case 'téléphone':
      return 'dispositifs.type.téléphone';
    case 'navigateur':
      return 'dispositifs.type.navigateur';
    case 'tablette':
      return 'dispositifs.type.tablette';
    case 'ordinateur':
      return 'dispositifs.type.ordinateur';
    case 'serveur':
      return 'dispositifs.type.serveur';
    default:
      return 'dispositifs.type.autre';
  }
};

export const obtIcôneDispositifDeType = (typeDispositif?: string) => {
  if (typeDispositif === 'téléphone') {
    return 'mdi-cellphone';
  } else if (typeDispositif === 'navigateur') {
    return 'mdi-application-outline';
  } else if (typeDispositif === 'tablette') {
    return 'mdi-tablet';
  } else if (typeDispositif === 'ordinateur') {
    return 'mdi-monitor';
  } else if (typeDispositif === 'serveur') {
    return 'mdi-server';
  } else {
    return 'mdi-monitor-cellphone';
  }
};

export const utiliserIlYA = ({
  vuÀ,
  t,
  clefs = {
    enLigne: 'membres.vu.enLigne',
    àLinstant: 'membres.vu.àLinstant',
    ilYAMinutes: 'membres.vu.ilYAMinutes',
    ilYAHeures: 'membres.vu.ilYAHeures',
    ilYAJours: 'membres.vu.ilYAJours',
    ilYASemaines: 'membres.vu.ilYASemaines',
    ilYAMois: 'membres.vu.ilYAMois',
    ilYALongtemps: 'membres.vu.ilYALongtemps',
  },
}: {
  vuÀ?: MaybeRef<number | undefined>;
  t: (
    clef: string,
    interpol?: {[clef: string]: unknown} | number | unknown[],
    n?: number,
  ) => string;
  clefs?: {
    enLigne: string;
    àLinstant: string;
    ilYAMinutes: string;
    ilYAHeures: string;
    ilYAJours: string;
    ilYASemaines: string;
    ilYAMois: string;
    ilYALongtemps: string;
  };
}): {
  ilYA: ComputedRef<number | undefined>;
  texte: ComputedRef<string>;
  ilYAMs: ComputedRef<number | undefined>;
} => {
  // Chronomètre
  const maintenant = ref(new Date().getTime());
  const refVuÀ = isRef(vuÀ) ? vuÀ : ref(vuÀ);
  let oublierChronomètre: number | undefined;
  onMounted(() => {
    oublierChronomètre = window.setInterval(() => {
      maintenant.value = new Date().getTime();
    }, 1000);
  });
  onUnmounted(() => {
    if (oublierChronomètre) clearInterval(oublierChronomètre);
  });
  const ilYA = computed(() => {
    return refVuÀ.value ? maintenant.value - refVuÀ.value : undefined;
  });

  const info = computed(() => {
    if (ilYA.value === undefined) {
      return {ilYA: 0, texte: clefs.enLigne};
    } else if (ilYA.value < 1000 * 60 * 2) {
      // < 2 minutes
      return {ilYA: 0, texte: clefs.àLinstant};
    } else if (ilYA.value < 1000 * 60 * 60) {
      // < 1 heure
      return {ilYA: Math.floor(ilYA.value / (1000 * 60)), texte: clefs.ilYAMinutes};
    } else if (ilYA.value < 1000 * 60 * 60 * 24) {
      // < 1 jour
      return {ilYA: Math.floor(ilYA.value / (1000 * 60 * 60)), texte: clefs.ilYAHeures};
    } else if (ilYA.value < 1000 * 60 * 60 * 24 * 7) {
      // < 1 semaine
      return {ilYA: Math.floor(ilYA.value / (1000 * 60 * 60 * 24)), texte: clefs.ilYAJours};
    } else if (ilYA.value < 1000 * 60 * 60 * 24 * 30) {
      // < 1 mois
      return {ilYA: Math.floor(ilYA.value / (1000 * 60 * 60 * 24 * 7)), texte: clefs.ilYASemaines};
    } else if (ilYA.value < 1000 * 60 * 60 * 24 * 365.25) {
      // < 1 an
      return {ilYA: Math.floor(ilYA.value / (1000 * 60 * 60 * 24 * 30)), texte: clefs.ilYAMois};
    }
    return {ilYA: 0, texte: clefs.ilYALongtemps};
  });

  const vuIlYANumérique = computed(() => info.value.ilYA || 0);
  const texte = computed(() => {
    if (info.value.ilYA) {
      return t(info.value.texte, {n: vuIlYANumérique.value}, info.value.ilYA);
    } else {
      return t(info.value.texte);
    }
  });

  return {
    ilYA: computed(() => info.value.ilYA),
    texte,
    ilYAMs: ilYA,
  };
};
