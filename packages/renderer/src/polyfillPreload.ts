const surLinux = undefined;
const surMac = undefined;
const surWindows = undefined;
const plateforme = undefined;

const requêteHttp = async () => {
  throw new Error(
    "Fonction `requêteHttp` non disponible sur la version navigateur de l'IUG. Utiliser uniquement si `isElectronRenderer === true`.",
  );
};

const redémarrer = async () => {
  window.location.reload();
};

const choisirDossier = async () => {
  throw new Error(
    "Fonction `choisirDossier` non disponible sur la version navigateur de l'IUG. Utiliser uniquement si `isElectronRenderer === true`.",
  );
};

export {surLinux, surMac, surWindows, plateforme, requêteHttp, choisirDossier, redémarrer};
