import type {valid} from '@constl/ipa';
import {suivre} from '@constl/vue';
import {computed, type ComputedRef, isRef, type MaybeRef, ref} from 'vue';

import {utiliserConstellation} from '/@/components/utils';

export const utiliserMonAutorisationRègleSourceErreur = ({
  erreur,
  idTableau,
}: {
  erreur: MaybeRef<
    | valid.erreurRègleBornesColonneInexistante
    | valid.erreurRègleBornesVariableNonPrésente
    | valid.erreurRègleCatégoriqueColonneInexistante
  >;
  idTableau: MaybeRef<string>;
}): ComputedRef<'MODÉRATEUR' | 'MEMBRE' | undefined> => {
  const réfErreur = isRef(erreur) ? erreur : ref(erreur);
  const réfIdTableau = isRef(idTableau) ? idTableau : ref(idTableau);

  const constl = utiliserConstellation();

  const monAutorisationTableau = suivre(constl.suivrePermission, {idObjet: réfIdTableau});

  const idVariableSource = computed(() => réfErreur.value.règle.source.id);
  const monAutorisationVariable = suivre(constl.suivrePermission, {idObjet: idVariableSource});

  const autorisationRègle = computed(() => {
    const {source} = réfErreur.value.règle;
    if (source.type === 'tableau') {
      return monAutorisationTableau.value;
    } else {
      return monAutorisationVariable.value;
    }
  });

  return autorisationRègle;
};
