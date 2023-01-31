declare module '@vue/runtime-core' {
  import type {MandataireClientConstellation} from '@constl/mandataire';
  import type {GestionnaireServeur} from '@constl/mandataire-electron-rendu';
  interface ComponentCustomProperties {
    $constl: MandataireClientConstellation;
    $serveurConstl: GestionnaireServeur;
  }
}

export {};
