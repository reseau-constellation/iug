/**
 * @module preload
 */

export {surLinux, surMac, surWindows, plateforme} from './so.js';

export {
  envoyerMessageÀConstellation,
  écouterMessagesDeConstellation,
  envoyerMessageÀServeurConstellation,
  écouterMessagesDeServeurConstellation,
} from '@constl/mandataire-electron-principal';
