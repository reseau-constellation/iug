import type {valid} from '@constl/ipa';
import {type ComputedRef, computed, ref} from 'vue';
import {constellation, enregistrerÉcoute} from '/@/components/utils';

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
  const constl = constellation();

  const monAutorisationTableau = ref<'MODÉRATEUR' | 'MEMBRE'>();
  enregistrerÉcoute(
    constl.suivrePermission({
      idObjet: idTableau,
      f: x => (monAutorisationTableau.value = x),
    }),
  );

  const monAutorisationVariable = ref<'MODÉRATEUR' | 'MEMBRE'>();
  const idVariableSource = erreur.règle.source.id;
  enregistrerÉcoute(
    constl.suivrePermission({
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
