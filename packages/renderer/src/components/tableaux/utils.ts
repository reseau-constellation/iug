import type {valid} from '@constl/ipa';
import type {ClientConstellation} from '@constl/ipa';

import {inject} from 'vue';

const constl = inject<ClientConstellation>('constl');

export const créerColonneTableau = async ({
  idTableau,
  idVariable,
  idColonne,
  index,
  règles,
}: {
  idTableau: string;
  idVariable: string;
  idColonne?: string;
  index?: boolean;
  règles: valid.règleVariableAvecId[];
}) => {
  const idColonneFinale = await constl?.tableaux.ajouterColonneTableau({
    idTableau,
    idVariable: idVariable,
    idColonne,
  });
  if (!idColonneFinale) return;

  if (index) {
    await constl?.tableaux.changerColIndex({
      idTableau,
      idColonne: idColonneFinale,
      val: true,
    });
  }
  for (const règle of règles) {
    await constl?.tableaux.ajouterRègleTableau({
      idTableau,
      idColonne: idColonneFinale,
      règle: règle.règle,
    });
  }
};
