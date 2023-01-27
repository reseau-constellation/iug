import {konojelChabäl, rubiChabäl} from 'nuchabal';

export const utiliserLangues = function () {
  const listeLanguesEtCodes = (): {lng: string; code: string}[] => {
    return konojelChabäl
      .map(code => {
        return {
          code,
          lng: rubiChabäl(code),
        };
      })
      .filter(x => x.lng) as {lng: string; code: string}[];
  };
  return {
    codesLanguesDisponibles: konojelChabäl,
    listeLanguesEtCodes,
  };
};
