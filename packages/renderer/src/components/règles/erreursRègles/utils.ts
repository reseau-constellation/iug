import type {client} from '@constl/ipa';
import type {
  erreurRègleBornesColonneInexistante,
  erreurRègleBornesVariableNonPrésente,
  erreurRègleCatégoriqueColonneInexistante,
} from '@constl/ipa/dist/src/valid';
import {type ComputedRef, computed, inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/components/utils';

export const utiliserMonAutorisationRègleSourceErreur = ({
  erreur,
  idTableau,
}: {
  erreur:
    | erreurRègleBornesColonneInexistante
    | erreurRègleBornesVariableNonPrésente
    | erreurRègleCatégoriqueColonneInexistante;
  idTableau: string;
}): ComputedRef<'MODÉRATEUR' | 'MEMBRE' | undefined> => {
  const constl = inject<client.ClientConstellation>('constl');

  const monAutorisationTableau = ref<'MODÉRATEUR' | 'MEMBRE'>();
  enregistrerÉcoute(
    constl?.suivrePermission({
      idObjet: idTableau,
      f: x => (monAutorisationTableau.value = x),
    }),
  );

  const monAutorisationVariable = ref<'MODÉRATEUR' | 'MEMBRE'>();
  const idVariableSource = erreur.règle.source.id;
  enregistrerÉcoute(
    constl?.suivrePermission({
      idObjet: idVariableSource,
      f: x => (monAutorisationVariable.value = x),
    }),
  );

  const autorisationRègle = computed(() => {
    const {source} = erreur.règle;
    if (source.type === 'tableau') {
      return monAutorisationTableau.value;
    } else {
      return monAutorisationVariable.value;
    }
  });

  return autorisationRègle;
};
