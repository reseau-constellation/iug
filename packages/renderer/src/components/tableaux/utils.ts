import type {variables as typesVariables, valid} from '@constl/ipa';

import {utiliserConstellation} from '../utils';

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
  règles: valid.règleVariable[];
}) => {
  const constl = utiliserConstellation();
  const idColonneFinale = await constl.tableaux.ajouterColonneTableau({
    idTableau,
    idVariable: idVariable,
    idColonne,
  });
  if (!idColonneFinale) return;

  if (index) {
    await constl.tableaux.changerColIndex({
      idTableau,
      idColonne: idColonneFinale,
      val: true,
    });
  }
  for (const règle of règles) {
    await constl.tableaux.ajouterRègleTableau({
      idTableau,
      idColonne: idColonneFinale,
      règle: règle,
    });
  }
};

const triables: typesVariables.catégorieBaseVariables[] = [
  'booléen',
  'chaîne',
  'chaîneNonTraductible',
  'horoDatage',
  'intervaleTemps',
  'numérique',
];
export const triable = (catégorieBase: typesVariables.catégorieBaseVariables): boolean => {
  return triables.includes(catégorieBase);
};
