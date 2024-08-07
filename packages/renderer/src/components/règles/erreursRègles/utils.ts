import type {valid} from '@constl/ipa';
import {suivre} from '@constl/vue';
import {type ComputedRef, computed} from 'vue';

import {utiliserConstellation} from '/@/components/utils';

export const utiliserMonAutorisationRègleSourceErreur = ({
  erreur,
  idTableau,
}: {
  erreur:
    | valid.erreurRègleBornesColonneInexistante
    | valid.erreurRègleBornesVariableNonPrésente
    | valid.erreurRègleCatégoriqueColonneInexistante;
  idTableau: string;
}): ComputedRef<'MODÉRATEUR' | 'MEMBRE' | undefined> => {
  const constl = utiliserConstellation();

  const monAutorisationTableau = suivre(constl.suivrePermission, {idObjet: idTableau});

  const idVariableSource = erreur.règle.source.id;
  const monAutorisationVariable = suivre(constl.suivrePermission, {idObjet: idVariableSource});

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
