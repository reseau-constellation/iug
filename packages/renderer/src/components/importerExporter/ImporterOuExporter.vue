<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex align-center">
          {{ t(titreCarte) }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          />
        </v-card-title>
        <v-card-subtitle> {{ t(sousTitreCarte) }} </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <v-window
          v-model="étape"
          style="overflow-y: scroll"
        >
          <v-window-item :value="0">
            <div class="text-center">
              <v-btn
                class="ma-3"
                variant="outlined"
                append-icon="mdi-import"
                @click="suivreCheminementImportation"
              >
                {{ t('communs.importerOuExporter.importer') }}
              </v-btn>
              <v-btn
                class="ma-3"
                variant="outlined"
                append-icon="mdi-export"
                @click="suivreCheminementExportation"
              >
                {{ t('communs.importerOuExporter.exporter') }}
              </v-btn>
            </div>
          </v-window-item>
          <v-window-item :value="3">
            <span v-if="formatImportation === 'tableau'">
              <v-select :items="colonnesImportation" />
              <v-select :items="idsColonnesTableauConstellation" />
              <v-combobox chips />
            </span>
            <span v-else-if="formatImportation === 'json'">
              <v-select
                multiple
                chips
              />
              <v-select
                multiple
                chips
              />
            </span>
          </v-window-item>
          <v-window-item :value="9">
            <div class="text-center">
              <v-btn
                class="ma-3"
                variant="flat"
                color="primary"
                :disabled="
                  surNavigateur &&
                    (cheminement === 'exportation' || origineImportation === 'fichier')
                "
              >
                {{ t('communs.importerOuExporter.automatiser') }}
              </v-btn>
              <v-btn
                class="ma-3"
                variant="outlined"
              >
                {{ t('communs.importerOuExporter.nePasAutomatiser') }}
              </v-btn>
            </div>
          </v-window-item>
          <v-window-item :value="11">
            <div class="text-center">
              <h3 class="text-h6 font-weight-light mb-2">
                {{ t('communs.importerOuExporter.messageConfirmer') }}
              </h3>
              <p>
                <v-btn
                  class="mt-3"
                  variant="outlined"
                  :loading="enConfirmation"
                >
                  {{ t('communs.importerOuExporter.confirmer') }}
                </v-btn>
              </p>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <btn-retour
          :visible="retourActif.visible"
          :actif="retourActif.actif"
          @retour="retour"
        />
        <v-spacer></v-spacer>
        <btn-suivant
          :visible="suivantActif.visible"
          :actif="suivantActif.actif"
          @suivant="suivant"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';
import {suivre} from '@constl/vue';

import type {clefsExtraction} from '@constl/ipa/dist/importateur/json';
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';
import {isElectronMain, isNode} from 'wherearewe';
import {utiliserConstellation} from '../utils';
import BtnRetour from '/@/components/communs/BtnRetour.vue';
import BtnSuivant from '/@/components/communs/BtnSuivant.vue';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const {mdAndUp} = useDisplay();

const constl = utiliserConstellation();

const props = defineProps<{
  type?: 'importation' | 'exportation';
  automatiser?: boolean;
  infoObjet?: {id: string; typeObjet: 'bd' | 'tableau' | 'projet' | 'nuée'};
}>();

const surNavigateur = !isNode && !isElectronMain;

// Navigation générale
const dialogue = ref(false);
const listeÉtapes = [
  'importerOuExporter',
  'objetConstellation',

  // Pour importations
  'sourceImportation',
  'correspondancesImportation',

  // Pour exportations
  'dossierExportation',
  'inclureSFIPExportation',
  'languesExportation',
  'formatDocExportation',

  // Pour automatisations
  'voulezVousAutomatiser',
  'fréquence',
  'dispositif',

  'confirmation',
] as const;

const étape = ref(
  listeÉtapes.indexOf(
    props.type
      ? props.infoObjet
        ? props.type === 'exportation'
          ? 'dossierExportation'
          : 'sourceImportation'
        : 'objetConstellation'
      : 'importerOuExporter',
  ),
);

const cheminement = ref(props.type);
const cheminementAjouterAutomatisation = ref<boolean>();

const suivant = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'importerOuExporter':
      étape.value = listeÉtapes.indexOf(
        props.infoObjet
          ? cheminement.value === 'importation'
            ? 'sourceImportation'
            : 'dossierExportation'
          : 'objetConstellation',
      );
      break;

    case 'correspondancesImportation':
    case 'formatDocExportation':
      étape.value = listeÉtapes.indexOf(props.automatiser ? 'fréquence' : 'voulezVousAutomatiser');
      break;

    default:
      étape.value++;
      break;
  }
};

const retour = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'confirmation':
      étape.value = listeÉtapes.indexOf(
        cheminementAjouterAutomatisation.value
          ? 'dispositif'
          : cheminement.value === 'importation'
            ? 'correspondancesImportation'
            : 'formatDocExportation',
      );
      break;

    case 'voulezVousAutomatiser':
      étape.value = listeÉtapes.indexOf(
        cheminement.value === 'importation' ? 'correspondancesImportation' : 'formatDocExportation',
      );
      break;

    case 'sourceImportation':
    case 'dossierExportation':
      étape.value = listeÉtapes.indexOf(
        props.infoObjet ? (props.type ? é : 'importerOuExporter') : 'objetConstellation',
      );
      break;

    default:
      étape.value--;
      break;
  }
};

const suivantActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'importerOuExporter':
      return {actif: false, visible: false};
    case 'objetConstellation':
      return {actif: !!(idObjet.value && typeObjet.value), visible: true};
    case 'sourceImportation':
      return {actif: !!sourceImportation.value, visible: true};
    case 'correspondancesImportation':
      return {actif: !!correspondancesImportationBienSpécifiées.value, visible: true};
    case 'dossierExportation':
      return {actif: !!dossierExportation.value, visible: true};
    case 'inclureSFIPExportation':
      return {actif: !!inclureSFIPExportation.value, visible: true};
    case 'languesExportation':
      return {actif: !!languesExportation.value, visible: true};
    case 'formatDocExportation':
      return {actif: !!formatDocExportation.value, visible: true};
    case 'voulezVousAutomatiser':
      return {actif: aussiAjouterAutomatisation.value !== undefined, visible: true};
    case 'fréquence':
      return {actif: !!fréquence.value, visible: true};
    case 'dispositif':
      return {actif: !!dispositifAutomatisation.value, visible: true};
    case 'confirmation':
      return {actif: false, visible: false};
    default:
      return {actif: true, visible: true};
  }
});

const retourActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'importerOuExporter':
      return {actif: false, visible: false};
    case 'confirmation':
      return {actif: !enConfirmation.value, visible: true};
    default:
      return {actif: true, visible: true};
  }
});
const suivreCheminementImportation = () => {
  cheminement.value = 'importation';
  étape.value = listeÉtapes.indexOf('sourceImportation');
};
const suivreCheminementExportation = () => {
  cheminement.value = 'exportation';
  étape.value = listeÉtapes.indexOf('dossierExportation');
};

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'importerOuExporter':
      return 'communs.importerOuExporter.titreImporterOuExporter';
    case 'objetConstellation':
      return 'communs.importerOuExporter.titreObjetConstellation';
    case 'sourceImportation':
      return 'communs.importerOuExporter.titreSourceImportation';
    case 'correspondancesImportation':
      return 'communs.importerOuExporter.titreCorrespondancesImportation';
    case 'dossierExportation':
      return 'communs.importerOuExporter.titreDossierExportation';
    case 'inclureSFIPExportation':
      return 'communs.importerOuExporter.titreInclureSFIPExportation';
    case 'languesExportation':
      return 'communs.importerOuExporter.titreLanguesExportation';
    case 'formatDocExportation':
      return 'communs.importerOuExporter.titreFormatDocExportation';
    case 'voulezVousAutomatiser':
      return 'communs.importerOuExporter.titreVoulezVousAutomatiser';
    case 'fréquence':
      return 'communs.importerOuExporter.titreFréquence';
    case 'dispositif':
      return 'communs.importerOuExporter.titreDispositif';
    case 'confirmation':
      return 'communs.importerOuExporter.titreconfirmation';
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'importerOuExporter':
      return 'communs.importerOuExporter.sousTitreImporterOuExporter';
    case 'objetConstellation':
      return 'communs.importerOuExporter.sousTitreObjetConstellation';
    case 'sourceImportation':
      return 'communs.importerOuExporter.sousTitreSourceImportation';
    case 'correspondancesImportation':
      return 'communs.importerOuExporter.sousTitreCorrespondancesImportation';
    case 'dossierExportation':
      return 'communs.importerOuExporter.sousTitreDossierExportation';
    case 'inclureSFIPExportation':
      return 'communs.importerOuExporter.sousTitreInclureSFIPExportation';
    case 'languesExportation':
      return 'communs.importerOuExporter.sousTitreLanguesExportation';
    case 'formatDocExportation':
      return 'communs.importerOuExporter.sousTitreFormatDocExportation';
    case 'voulezVousAutomatiser':
      return 'communs.importerOuExporter.sousTitreVoulezVousAutomatiser';
    case 'fréquence':
      return 'communs.importerOuExporter.sousTitreFréquence';
    case 'dispositif':
      return 'communs.importerOuExporter.sousTitreDispositif';
    case 'confirmation':
      return 'communs.importerOuExporter.sousTitreconfirmation';
    default:
      return '';
  }
});

// Objet Constellation
const idObjet = ref(props.infoObjet?.id);
const typeObjet = ref(props.infoObjet?.typeObjet);
// Exportation
const dossierExportation = ref<string>();
const inclureSFIPExportation = ref<boolean>();

// Importation
const fichierImportation = ref<string>();
const urlImportation = ref<string>();
const origineImportation = ref<'url' | 'fichier'>();

const colonnesTableauConstellation = suivre(constl.bds.suivreTableauxBd, {idBd: idObjet});
const idsColonnesTableauConstellation = computed(() => {
  return colonnesTableauConstellation.value?.map(c => c.id);
});

const colonnesImportation = ref<string[]>();

const formatFichierImportation = computed<'json' | 'tableau' | undefined>(() => {
  const ext = fichierImportation.value?.split('.').pop();
  if (!ext) return undefined;
  return ext === 'json' ? ext : 'tableau';
});
const formatURLImportation = ref<'json' | 'tableau'>();
const formatImportation = computed(() => {
  const format =
    origineImportation.value === 'fichier'
      ? formatFichierImportation.value
      : formatURLImportation.value;
  return format;
});
const correspondancesJSONClefRacine = ref<clefsExtraction>();
const correspondancesJSONClefsÉléments = ref<clefsExtraction>();
const correspondancesJSONCols = ref<{[key: string]: clefsExtraction}>();

const correspondancesFeuilleCalculNomTableau = ref<string>();
const correspondancesFeuilleCalculCols = ref<{[key: string]: string}>();
const correspondancesFeuilleCalculOptionsXLSX = ref<automatisation.XLSXParsingOptions>();

const générerInfoJSON = (): automatisation.infoImporterJSON => {
  if (!correspondancesJSONClefRacine.value) throw new Error('Clefs racine JSON non définies.');
  if (!correspondancesJSONClefsÉléments.value) throw new Error('Clefs éléments JSON non définies.');
  if (!correspondancesJSONCols.value) throw new Error('Colonnes JSON non définies.');
  return {
    formatDonnées: 'json',
    clefsRacine: correspondancesJSONClefRacine.value,
    clefsÉléments: correspondancesJSONClefsÉléments.value,
    cols: correspondancesJSONCols.value,
  };
};
const générerInfoTableau = (): automatisation.infoImporterFeuilleCalcul => {
  if (!correspondancesFeuilleCalculNomTableau.value) throw new Error('Nom tableau non défini.');
  if (!correspondancesFeuilleCalculCols.value)
    throw new Error('Colonnes feuille calcul non définies.');

  return {
    formatDonnées: 'feuilleCalcul',
    nomTableau: correspondancesFeuilleCalculNomTableau.value,
    cols: correspondancesFeuilleCalculCols.value,
    optionsXLSX: correspondancesFeuilleCalculOptionsXLSX.value,
  };
};
const sourceImportation = computed<
  | automatisation.SourceDonnéesImportation<
      automatisation.infoImporterJSON | automatisation.infoImporterFeuilleCalcul
    >
  | undefined
>(() => {
  if (!origineImportation.value) return undefined;

  if (origineImportation.value === 'fichier') {
    if (!fichierImportation.value) throw new Error('Fichier importation non défini.');
    if (formatImportation.value === 'json') {
      const source: automatisation.SourceDonnéesImportationFichier<automatisation.infoImporterJSON> =
        {
          typeSource: origineImportation.value,
          adresseFichier: fichierImportation.value,
          info: générerInfoJSON(),
        };
      return source;
    } else {
      const source: automatisation.SourceDonnéesImportationFichier<automatisation.infoImporterFeuilleCalcul> =
        {
          typeSource: origineImportation.value,
          adresseFichier: fichierImportation.value,
          info: générerInfoTableau(),
        };
      return source;
    }
  } else {
    if (!urlImportation.value) throw new Error('URL importation non défini.');
    if (formatImportation.value === 'json') {
      const source: automatisation.SourceDonnéesImportationURL<automatisation.infoImporterJSON> = {
        typeSource: origineImportation.value,
        url: urlImportation.value,
        info: générerInfoJSON(),
      };
      return source;
    } else {
      const urlRésolu = résoudreUrl(urlImportation.value);
      const source: automatisation.SourceDonnéesImportationURL<automatisation.infoImporterFeuilleCalcul> =
        {
          typeSource: origineImportation.value,
          url: urlRésolu,
          info: générerInfoTableau(),
        };
      return source;
    }
  }
});

const résoudreUrl = (url: string): string => {
  // Convertir document google à url téléchargement CSV
  const domaine = new URL(url);
  const docGoogle = domaine.hostname === 'docs.google.com';
  if (docGoogle && !domaine.href.includes('gviz')) {
    try {
      const nom_tableau = url.split('gid=')[1];
      const clef = url.split('spreadsheets/d/')[1].split('/edit#')[0];
      return `https://docs.google.com/spreadsheets/d/${clef}/gviz/tq?tqx=out:csv&sheet=${nom_tableau}`;
    } catch {
      return url;
    }
  }
  return url;
};

const correspondancesImportationBienSpécifiées = computed(() => {
  switch (formatImportation.value) {
    case 'json':
      return !!(
        correspondancesJSONClefRacine.value &&
        correspondancesJSONClefsÉléments.value &&
        correspondancesJSONCols.value
      );

    case 'tableau':
      return !!(
        correspondancesFeuilleCalculNomTableau.value &&
        correspondancesFeuilleCalculCols.value &&
        correspondancesFeuilleCalculOptionsXLSX.value
      );

    default:
      return false;
  }
});

// Options exportation
const languesExportation = ref<string[]>();
const formatDocExportation = ref<automatisation.formatTélécharger>();

// Automatisation
const fréquence = ref<automatisation.fréquence>();
const dispositifAutomatisation = ref<string>();

const aussiAjouterAutomatisation = ref<boolean>();

// Confirmer
const enConfirmation = ref(false);
</script>
