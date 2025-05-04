import {adresseOrbiteValide} from '@constl/utils-ipa';
import {isEqual} from 'lodash-es';
import {computed, ref, watchEffect, type Ref} from 'vue';

export const utiliserOptionsÉpingles = (): {
  titre: string;
  sousTitre: string;
  icône: string;
  valeur: 'AUCUN' | 'TOUS' | 'INSTALLÉ' | 'SPÉCIFIQUES';
}[] => {
  return [
    {
      titre: 'épingler.aucun',
      sousTitre: 'épingler.indiceAucun',
      icône: 'mdi-cancel',
      valeur: 'AUCUN',
    },
    {
      titre: 'épingler.tous',
      sousTitre: 'épingler.indiceTous',
      icône: 'mdi-devices',
      valeur: 'TOUS',
    },
    {
      titre: 'épingler.installé',
      sousTitre: 'épingler.indiceInstallé',
      icône: 'mdi-monitor',
      valeur: 'INSTALLÉ',
    },
    {
      titre: 'épingler.dispositifsSpécifiques',
      sousTitre: 'épingler.indiceDispositifsSpécifiques',
      icône: 'mdi-monitor-cellphone-star',
      valeur: 'SPÉCIFIQUES',
    },
  ];
};

export const optionsDispositifs = (
  valeur: Ref<'AUCUN' | 'TOUS' | 'INSTALLÉ' | string | string[] | undefined>,
  défaut: 'AUCUN' | 'TOUS' | 'INSTALLÉ' = 'AUCUN',
) => {
  const sélection = ref<'AUCUN' | 'TOUS' | 'INSTALLÉ' | 'SPÉCIFIQUES'>(défaut);
  const spécifiques = ref<string[]>([]);
  const dispositifs = computed(() => {
    if (sélection.value === 'SPÉCIFIQUES') return spécifiques.value;
    else return sélection.value;
  });
  const valide = computed(() => {
    return sélection.value === 'SPÉCIFIQUES' ? spécifiques.value?.length > 0 : true;
  });
  const modifié = computed(() => {
    if (valeur.value === 'AUCUN' || valeur.value === undefined) {
      return sélection.value !== 'AUCUN';
    } else if (Array.isArray(valeur.value)) {
      return !isEqual(new Set(valeur.value), new Set(sélection.value));
    } else {
      return valeur.value !== sélection.value;
    }
  });

  watchEffect(() => {
    if (sélection.value !== 'SPÉCIFIQUES') spécifiques.value = [];
  });

  watchEffect(() => {
    if (valeur.value === undefined) {
      sélection.value = 'AUCUN';
    } else if (Array.isArray(valeur.value) || adresseOrbiteValide(valeur.value)) {
      sélection.value = 'SPÉCIFIQUES';
      spécifiques.value = Array.isArray(valeur.value) ? valeur.value : [valeur.value];
    } else if (valeur.value === 'INSTALLÉ' || valeur.value === 'TOUS') {
      sélection.value = valeur.value;
    }
  });

  return {
    sélection,
    spécifiques,
    dispositifs,
    valide,
    modifié,
  };
};
