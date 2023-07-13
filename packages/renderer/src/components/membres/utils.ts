import type {client} from '@constl/ipa';
import type {utils} from '@constl/ipa';
import {type Ref, computed, ref, watchEffect, inject} from 'vue';
import {enregistrerÉcoute} from '../utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

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
  const constl = inject<client.ClientConstellation>('constl');
  const {useI18n} = கிளிமூக்கை_உபயோகி();
  const {t} = useI18n();

  const monCompte = ref<string>();
  enregistrerÉcoute(
    constl?.suivreIdBdCompte({
      f: x => (monCompte.value = x),
    }),
  );

  const nomEtType = ref<{type: string; nom: string}>();
  let fOublier: utils.schémaFonctionOublier | undefined;

  watchEffect(async () => {
    if (fOublier) await fOublier();

    const valIdCompte =
      (typeof idCompte === 'string' ? idCompte : idCompte?.value) || monCompte.value;
    const valIdDispositif = typeof idDispositif === 'string' ? idDispositif : idDispositif.value;

    if (!valIdDispositif) return;

    fOublier = await enregistrerÉcoute(
      constl?.suivreNomDispositif({
        idCompte: valIdCompte,
        idDispositif: valIdDispositif,
        f: x => (nomEtType.value = x),
      }),
    );
  });

  const nomDispositif = computed(() => {
    return nomEtType.value?.['nom'] || nomEtType.value?.['type']
      ? t(nomGénériqueTypeDispositif(nomEtType.value?.['type']))
      : undefined;
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
