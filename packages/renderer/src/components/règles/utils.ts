import type {valid} from '@constl/ipa';
import type {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

type typeT = ReturnType<typeof மொழியாக்கத்தைப்_பயன்படுத்து>['$மொ'];
export const texteInfoRègle = ({règle, t}: {règle: valid.règleVariable; t: typeT}): string => {
  switch (règle.typeRègle) {
    case 'catégorie':
      return t('règles.infos.catégorie', {
        categorie: t(`variables.catégories.${règle.détails.catégorie.catégorie}`),
      });
    case 'bornes':
      return t('règles.infos.bornes', {val: règle.détails.val, op: règle.détails.op});
    case 'existe':
      return t('règles.infos.existe');
    case 'valeurCatégorique':
      return t('règles.infos.valeurCatégorique');
    default:
      return '';
  }
};
