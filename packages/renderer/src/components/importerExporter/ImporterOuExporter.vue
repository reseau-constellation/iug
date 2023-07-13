<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsComposante}">
      <slot
        name="activator"
        v-bind="{props: propsComposante}"
      ></slot>
    </template>
    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="text-h5 justify-space-between">
          <span>{{ titreCarte }}</span>
        </v-card-title>
        <v-card-subtitle> {{ sousTitreCarte }} </v-card-subtitle>
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
                variant="flat"
                color="primary"
                @click="suivreCheminementImportation"
              >
                {{ t('communs.importerOuExporter.importer') }}
              </v-btn>
              <v-btn
                class="ma-3"
                variant="outlined"
                @click="suivreCheminementExportation"
              >
                {{ t('communs.importerOuExporter.exporter') }}
              </v-btn>
            </div>
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
                  @click="() => confirmer()"
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
        <v-btn
          v-show="retourActif.visible"
          variant="text"
          :disabled="!retourActif.actif"
          @click="retour"
        >
          {{ t('communs.retour') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-show="suivantActif.visible"
          color="primary"
          variant="flat"
          :disabled="!suivantActif.actif"
          @click="suivant"
        >
          {{ t('communs.suivant') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';
import type {clefsExtraction} from '@constl/ipa/dist/src/importateur/json';
import type {client} from '@constl/ipa';

import {computed, ref, inject} from 'vue';
import {isElectronMain, isNode} from 'wherearewe';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {useDisplay} from 'vuetify';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const {mdAndUp} = useDisplay();

const constl = inject<client.ClientConstellation>('constl');

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
      return t('communs.importerOuExporter.titreimporterOuExporter');
    case 'objetConstellation':
      return t('communs.importerOuExporter.titreObjetConstellation');
    case 'sourceImportation':
      return t('communs.importerOuExporter.titreSourceImportation');
    case 'correspondancesImportation':
      return t('communs.importerOuExporter.titreCorrespondancesImportation');
    case 'dossierExportation':
      return t('communs.importerOuExporter.titreDossierExportation');
    case 'inclureSFIPExportation':
      return t('communs.importerOuExporter.titreInclureSFIPExportation');
    case 'languesExportation':
      return t('communs.importerOuExporter.titreLanguesExportation');
    case 'formatDocExportation':
      return t('communs.importerOuExporter.titreFormatDocExportation');
    case 'voulezVousAutomatiser':
      return t('communs.importerOuExporter.titreVoulezVousAutomatiser');
    case 'fréquence':
      return t('communs.importerOuExporter.titreFréquence');
    case 'dispositif':
      return t('communs.importerOuExporter.titreDispositif');
    case 'confirmation':
      return t('communs.importerOuExporter.titreconfirmation');
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'importerOuExporter':
      return t('communs.importerOuExporter.sousTitreimporterOuExporter');
    case 'objetConstellation':
      return t('communs.importerOuExporter.sousTitreObjetConstellation');
    case 'sourceImportation':
      return t('communs.importerOuExporter.sousTitreSourceImportation');
    case 'correspondancesImportation':
      return t('communs.importerOuExporter.sousTitreCorrespondancesImportation');
    case 'dossierExportation':
      return t('communs.importerOuExporter.sousTitreDossierExportation');
    case 'inclureSFIPExportation':
      return t('communs.importerOuExporter.sousTitreInclureSFIPExportation');
    case 'languesExportation':
      return t('communs.importerOuExporter.sousTitreLanguesExportation');
    case 'formatDocExportation':
      return t('communs.importerOuExporter.sousTitreFormatDocExportation');
    case 'voulezVousAutomatiser':
      return t('communs.importerOuExporter.sousTitreVoulezVousAutomatiser');
    case 'fréquence':
      return t('communs.importerOuExporter.sousTitreFréquence');
    case 'dispositif':
      return t('communs.importerOuExporter.sousTitreDispositif');
    case 'confirmation':
      return t('communs.importerOuExporter.sousTitreconfirmation');
    default:
      return '';
  }
});

// Exportation
const dossierExportation = ref<string>();
const inclureSFIPExportation = ref<boolean>();

// Importation
const fichierImportation = ref<string>();
const urlImportation = ref<string>();
const origineImportation = ref<'url' | 'fichier'>();

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
  automatisation.SourceDonnéesImportation<
    automatisation.infoImporterJSON | automatisation.infoImporterFeuilleCalcul
  >
>(() => {
  if (!origineImportation.value) throw new Error('Format fichier importation non défini.');

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

// Objet Constellation
const idObjet = ref(props.infoObjet?.id);
const typeObjet = ref(props.infoObjet?.typeObjet);
const typesObjetsPourImportation = ['tableau', 'bd'];

// Options exportation
const languesExportation = ref<string[]>();
const formatDocExportation = ref<automatisation.formatTélécharger>();

// Automatisation
const fréquence = ref<automatisation.fréquence>();
const dispositifAutomatisation = ref<string>();

const aussiAjouterAutomatisation = ref<boolean>();

// Confirmer
const enConfirmation = ref(false);
const ajouterAutomatisation = async () => {
  if (!idObjet.value) throw new Error('Id objet non défini.');

  if (cheminement.value === 'importation') {
    if (!sourceImportation.value) throw new Error('Source importation non définie.');
    if (!typeObjet.value || !typesObjetsPourImportation.includes(typeObjet.value))
      throw new Error(`Objet de type ${typeObjet.value} ne peut pas être importé.`);

    switch (typeObjet.value) {
      case 'tableau':
        await constl?.automatisations?.ajouterAutomatisationImporter({
          idTableau: idObjet.value,
          source: sourceImportation.value,
          fréquence: fréquence.value,
          dispositif: dispositifAutomatisation.value,
        });
        break;
      default:
        throw new Error(`Impossible d'importer vers objet de type ${typeObjet.value}.`);
    }
  } else if (cheminement.value === 'exportation') {
    if (!typeObjet.value) throw new Error('Type objet non défini.');
    if (!formatDocExportation.value) throw new Error('Format document exportation non défini.');
    if (!dossierExportation.value) throw new Error('Dossier exportation non défini.');
    if (!inclureSFIPExportation.value)
      throw new Error('Inclure fichiers SFIP exportation non spécifié.');
    if (!dispositifAutomatisation.value) throw new Error('Dispositif exportation non défini.');

    await constl?.automatisations?.ajouterAutomatisationExporter({
      id: idObjet.value,
      typeObjet: typeObjet.value,
      formatDoc: formatDocExportation.value,
      inclureFichiersSFIP: inclureSFIPExportation.value,
      dossier: dossierExportation.value,
      langues: languesExportation.value,
      fréquence: fréquence.value,
      dispositifs: [dispositifAutomatisation.value],
    });
  } else {
    throw new Error('Cheminement non défini :' + cheminement.value);
  }
};
const confirmer = async () => {
  enConfirmation.value = true;
  if (!idObjet.value) throw new Error('Id objet cible non définie.');

  // Importer ou exporter immédiatement si ce n'était pas un dialogue d'ajout d'automatisation
  if (!props.automatiser) {
    if (cheminement.value === 'importation') {
      if (!dispositifAutomatisation.value) throw new Error('Dispositif importation non défini.');
      const spécificationImporter: automatisation.SpécificationImporter = {
        type: 'importation',
        id: Math.random().toString(), // Sera ignoré de toute façon, car on le l'ajoute pas à une automatisation ici. On devrait revoir les types !
        idTableau: idObjet.value,
        dispositif: dispositifAutomatisation.value,
        source: sourceImportation.value,
      };
      const données = await constl?.automatisations?.obtDonnéesImportation(spécificationImporter);
      if (données) {
        await constl?.tableaux?.importerDonnées({
          idTableau: idObjet.value,
          données,
        });
      }
    } else if (cheminement.value === 'exportation') {
      if (!formatDocExportation.value) throw new Error('Format document exportation non défini.');

      switch (typeObjet.value) {
        case 'tableau': {
          const données = await constl?.tableaux?.exporterDonnées({
            idTableau: idObjet.value,
            langues: languesExportation.value,
          });
          if (!données) throw new Error('Constellation non définie.');
          await constl?.bds?.exporterDocumentDonnées({
            données,
            formatDoc: formatDocExportation.value,
            inclureFichiersSFIP: inclureSFIPExportation.value,
            dossier: dossierExportation.value,
          });
          break;
        }
        case 'bd': {
          const données = await constl?.bds?.exporterDonnées({
            id: idObjet.value,
            langues: languesExportation.value,
          });
          if (!données) throw new Error('Constellation non définie.');
          await constl?.bds?.exporterDocumentDonnées({
            données,
            formatDoc: formatDocExportation.value,
            inclureFichiersSFIP: inclureSFIPExportation.value,
            dossier: dossierExportation.value,
          });
          break;
        }
        case 'projet': {
          const données = await constl?.projets?.exporterDonnées({
            id: idObjet.value,
            langues: languesExportation.value,
          });
          if (!données) throw new Error('Constellation non définie.');
          await constl?.projets?.exporterDocumentDonnées({
            données,
            formatDoc: formatDocExportation.value,
            inclureFichiersSFIP: inclureSFIPExportation.value,
            dossier: dossierExportation.value,
          });
          break;
        }
        case 'nuée': {
          const données = await constl?.nuées?.exporterDonnéesNuée({
            idNuée: idObjet.value,
            langues: languesExportation.value,
            nRésultatsDésirés: 1000,
          });
          if (!données) throw new Error('Constellation non définie.');
          await constl?.bds?.exporterDocumentDonnées({
            données,
            formatDoc: formatDocExportation.value,
            inclureFichiersSFIP: inclureSFIPExportation.value,
            dossier: dossierExportation.value,
          });
          break;
        }
        default:
          break;
      }
    }
  }

  // Ajouter automatisation si nécessaire
  const automatiser = props.automatiser || aussiAjouterAutomatisation.value;
  if (automatiser) await ajouterAutomatisation();

  enConfirmation.value = false;
  dialogue.value = false;
};
</script>
