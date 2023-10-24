declare module '@vue/runtime-core' {
  import type {ClientConstellation} from '@constl/ipa';
  import type {GestionnaireServeur} from '@constl/mandataire-electron-rendu';
  interface ComponentCustomProperties {
    $constl: ClientConstellation;
    $serveurConstl: GestionnaireServeur;
  }
}

export {};
