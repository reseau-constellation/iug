declare module '@vue/runtime-core' {
  import type {Constellation} from '@constl/ipa';
  import type {GestionnaireServeur} from '@constl/mandataire-electron-rendu';
  interface ComponentCustomProperties {
    $constl: Constellation;
    $serveurConstl: GestionnaireServeur;
  }
}

export {};
