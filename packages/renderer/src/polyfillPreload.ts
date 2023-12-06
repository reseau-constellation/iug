const surLinux = undefined;
const surMac = undefined;
const surWindows = undefined;
const plateforme = undefined;
const requèteHttp = async () => {
  throw new Error(
    "Fonction `requèteHttp` non disponible sur la version navigateur de l'IUG. Utiliser uniquement si `isElectron === true`.",
  );
};
export {surLinux, surMac, surWindows, plateforme, requèteHttp};
