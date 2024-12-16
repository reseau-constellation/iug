import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import { computed, ref, watchEffect } from 'vue';
import { type Ref } from 'vue';
import {adresseOrbiteValide} from '@constl/utils-ipa';
import { isEqual } from 'lodash-es';

export const utiliserOptionsÉpingles = (): {
    titre: string;
    sousTitre: string;
    icône: string;
    valeur: 'AUCUN' | 'TOUS' | 'INSTALLÉ' | 'SPÉCIFIQUES';
  }[] => {
  const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
  const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

  return  [
    {
      titre: t('épingler.aucun'),
      sousTitre: t('épingler.indiceAucun'),
      icône: 'mdi-cancel',
      valeur: 'AUCUN',
    },
    {
      titre: t('épingler.tous'),
      sousTitre: t('épingler.indiceTous'),
      icône: 'mdi-devices',
     valeur: 'TOUS',
    },
    {
        titre: t('épingler.installé'),
        sousTitre: t('épingler.indiceInstallé'),
        icône: 'mdi-monitor',
        valeur: 'INSTALLÉ',
    },
    {
        titre: t('épingler.dispositifsSpécifiques'),
        sousTitre: t('épingler.indiceDispositifsSpécifiques'),
        icône: 'mdi-monitor-cellphone-star',
        valeur: 'SPÉCIFIQUES',
    },
    ];
};

export const optionsDispositifs = (valeur: Ref<'AUCUN' | 'TOUS' | 'INSTALLÉ' | string | string[] | undefined>, défaut:'AUCUN' | 'TOUS' | 'INSTALLÉ'='AUCUN') => {
  const sélection = ref<'AUCUN' | 'TOUS' | 'INSTALLÉ' | 'SPÉCIFIQUES'>(défaut);
  const spécifiques = ref<string[]>([]);
  const dispositifs = computed(()=>{
    if (sélection.value === 'SPÉCIFIQUES') return spécifiques.value;
    else return sélection.value;
  });
  const valide = computed(() => {
    return sélection.value === 'SPÉCIFIQUES' ? spécifiques.value?.length : true;
  });
  const modifié = computed(()=>{
    if (valeur.value === 'AUCUN' || valeur.value === undefined) {
      return sélection.value !== 'AUCUN';
    } else if (Array.isArray(valeur.value)) {
      return !isEqual(new Set(valeur.value), new Set(sélection.value));
    } else {
      return valeur.value !== sélection.value;
    };
  });

  watchEffect(()=>{
    if (sélection.value !== 'SPÉCIFIQUES') spécifiques.value = [];
  });

  watchEffect(()=>{
    if (valeur.value === undefined) {
      sélection.value = 'AUCUN';
    } else if (Array.isArray(valeur.value) || adresseOrbiteValide(valeur.value)) {
      sélection.value = 'SPÉCIFIQUES';
      spécifiques.value = Array.isArray(valeur.value) ? valeur.value : [valeur.value];
    } else if (valeur.value  === 'INSTALLÉ' || valeur.value === 'TOUS') {
      sélection.value = valeur.value;
    }
  });

  return {
    sélection, spécifiques, dispositifs, valide, modifié,
  };
};