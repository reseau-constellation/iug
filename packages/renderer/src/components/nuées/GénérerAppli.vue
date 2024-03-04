<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="text-h5 justify-space-between">
          <span>{{ t(titreCarte) }}</span>
        </v-card-title>
        <v-card-subtitle> {{ t(sousTitreCarte) }} </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <v-window
          v-model="étape"
          style="overflow-y: scroll"
        >
          <v-window-item :value="0">
            <v-btn
              :loading="enGénération"
              @click="() => générerPaquetComplet()"
            >
              Magie !!
            </v-btn>
            <v-btn @click="suivant" />
          </v-window-item>
          <v-window-item :value="1">
            <dialogue-licence>
              <v-btn></v-btn>
            </dialogue-licence>
          </v-window-item>
          <v-window-item :value="2">
            <v-radio-group>
              <v-radio></v-radio>
              <v-radio></v-radio>
            </v-radio-group>
          </v-window-item>
          <v-window-item :value="3">
            <v-btn-toggle
              v-model="langage"
              mandatory
            >
              <v-btn
                v-for="l in langagesSupportés"
                :key="l"
                :value="l"
              >
                {{ t(`communs.langagesInformatiques.${l}.abr`) }}
              </v-btn>
            </v-btn-toggle>
            <v-select v-model="langueCode" />
            <v-row>
              <v-col
                cols="12"
                class="py-2"
              >
                <v-divider />
                <v-code-block
                  :code="installation"
                  lang="shell"
                  highlightjs
                  max-height="75"
                  theme="docco"
                ></v-code-block>
              </v-col>
              <v-col
                cols="12"
                class="py-2"
              >
                <v-divider />
                <v-code-block
                  :code="code"
                  lang="ts"
                  highlightjs
                  max-height="225"
                  theme="docco"
                ></v-code-block>
              </v-col>
            </v-row>
            <v-btn @click="() => générerPaquetComplet()"></v-btn>
          </v-window-item>
        </v-window>
      </v-card-text>
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
import type {bds} from '@constl/ipa';

import {computed, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';

import JSZip from 'jszip';
import {saveAs} from 'file-saver';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import VCodeBlock from '@wdns/vue-code-block';

import DialogueLicence from '/@/components/licences/DialogueLicence.vue';
import {GABARIT_CODE} from '/@/consts';
import {constellation} from '../utils';

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {மொழி} = மொழிகளைப்_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const props = defineProps<{idNuee: string}>();
const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = ['présentation', 'licenceParDéfaut', 'bdPrincipale', 'codeGénéré'] as const;

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'présentation':
      return 'nuées.générerCode.titrePrésentation';
    case 'licenceParDéfaut':
      return 'nuées.générerCode.titreLicenceParDéfaut';
    case 'bdPrincipale':
      return 'nuées.générerCode.titreBdPrincipale';
    case 'codeGénéré':
      return 'nuées.générerCode.titreCodeGénéré';
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'présentation':
      return 'nuées.générerCode.sousTitrePrésentation';
    case 'licenceParDéfaut':
      return 'nuées.générerCode.sousTitreLicenceParDéfaut';
    case 'bdPrincipale':
      return 'nuées.générerCode.sousTitreBdPrincipale';
    case 'codeGénéré':
      return 'nuées.générerCode.sousTitreCodeGénéré';
    default:
      return '';
  }
});

const retour = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      étape.value--;
      break;
  }
};

const suivant = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      étape.value++;
      break;
  }
};

const suivantActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      return {actif: true, visible: true};
  }
});

const retourActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      return {actif: true, visible: true};
  }
});

// Options
const langagesSupportés = ['ts', 'js'] as const;
const langage = ref<(typeof langagesSupportés)[number]>('ts');

const langueCode = ref<string>(மொழி.value);

const licenceDéfaut = ref('ODbl-1_0');
const motsClefNuée = ref<string[]>([]);
const bdPrincipale = ref<string>();

// Spécifications nuée
const clefTableauNuée = ref<string>();
const schémaSpécificationBdsNuée = ref<bds.schémaSpécificationBd>();

watchEffect(async () => {
  schémaSpécificationBdsNuée.value = await constl.nuées.générerSchémaBdNuée({
    idNuée: props.idNuee,
    licence: licenceDéfaut.value,
  });
});

const tableaux = computed(() => {
  return schémaSpécificationBdsNuée.value?.tableaux;
});

// Code
const code = computed(() => {
  switch (langage.value) {
    case 'ts':
      return codeNuéeTs.value;
    case 'js':
      return codeNuéeJs.value;
    default:
      throw new Error(langage.value);
  }
});
const installation = computed(() => {
  return `pnpm install @constl/ipa ${bdPrincipale.value ? '@lassi-js/kili' : ''}`;
});

// JS
const codeNuéeJs = computed(() => {
  return `
${codeImportationsJs.value}

${codeSchémaBdTsJs.value}

${codeFonctionGénérationTsJs.value}
`;
});

const codeImportationsJs = computed(() => {
  return `
${bdPrincipale.value ? "import { கிளி } from '@lassi-js/kili';" : ''}
`;
});

// TS
const codeNuéeTs = computed(() => {
  return `
${codeImportationsTs.value}

${codeSchémaBdTsJs.value}

${codeTypesTs.value}

${codeFonctionGénérationTsJs.value}
`;
});

const codeImportationsTs = computed(() => {
  return `
${codeImportationsJs.value}
import type ClientConstellation, { bds } from "@constl/ipa";
`;
});

const codeSchémaBdTsJs = computed(() => {
  if (!clefTableauNuée.value) throw new Error('Clef tableau nuée non spécifiée.');

  return `
export const clefTableauNuée = ${clefTableauNuée.value};
${bdPrincipale.value ? 'const idBd = ' + bdPrincipale.value : ''}
export const idNuée = ${props.idNuee}
export const schéma ${langage.value === 'ts' ? ': bds.schémaSpécificationBd' : ''} = {
  licence: ${licenceDéfaut.value},
  motsClefs: [${motsClefNuée.value.toString()}],
  tableaux: [
    ${codeSpécificationTableauxTsJs.value}
  ],
};
`;
});

const codeSpécificationTableauxTsJs = computed(() => {
  if (!tableaux.value) throw Error('Tableaux non définis.');

  return tableaux.value
    .map(t => {
      return `
{
  cols: [
${t.cols.map(c => générerCodeSpécificationCol(c)).join('\n')}
]
  clef: "${t.clef}",
},
`;
    })
    .join('\n');
});

const générerCodeSpécificationCol = (
  col: bds.schémaSpécificationBd['tableaux'][0]['cols'][0],
): string => {
  return `
{
  idColonne: ${col.idColonne};
  idVariable: ${col.idVariable};
${col.index ? 'index: true;' : ''}
}
`;
};

const codeTypesTs = computed(() => {
  const cols = tableaux.value?.find(t => t.clef === clefTableauNuée.value)?.cols;
  if (!cols) throw new Error('Colonnes non définies');
  return `
export type entréeDonnéesMonProjet = {
  ${cols.map(
    c => '[codeColonne' + c.idColonne + ']' + (c.optionnelle ? '?' : '') + ': string;',
  )} // À faire: type de colonne dynamique
};

export type KiliMonProjet = கிளி<entréeDonnéesMonProjet>;
`;
});

const codeFonctionGénérationTsJs = computed(() => {
  if (!bdPrincipale.value) return '';

  const ts = langage.value === 'ts';
  return `
export const générerKili = ({
  constl,
}${ts ? ': {\n  constl: ClientConstellation;\n}' : ''})${ts ? ': எண்ணிக்கை_கிளி' : ''} => {
  return new கிளி${ts ? '<முறைமை_தகவல்_வரிசை>' : ''}({
    விண்மீன்: constl,
    மாறிலிகள்: {
      அட்டவணை_சாபி: clefTableauNuée,
      வார்ப்புரு: schémaBd,
      தரவுத்தள_அடையாளம்: idBd,
      குழு_அடையாளம்: idNuée,
    },
  });
};
`;
});

// Code paquet complet

const générerCodeSpécificationNuée = (): string => {
  return `
${codeImportationsTs.value}

${codeSchémaBdTsJs.value}

`;
};

const enGénération = ref(false);
const générerPaquetComplet = async (): Promise<void> => {
  enGénération.value = true;
  const {requêteHttp} = await import('#preload');
  // Télécharger gabarit correspondant de GitHub
  const racineGabarit = await requêteHttp(GABARIT_CODE, {responseType: 'arraybuffer'});

  const zipRacineGabarit = await JSZip.loadAsync(racineGabarit as ArrayBuffer);
  const racineProjet = Object.keys(zipRacineGabarit.files)[0];
  const zipRacineProjet = zipRacineGabarit.folder(racineProjet);
  if (!zipRacineProjet) throw new Error('Erreur de structure de paquet.');

  // Générer les fichiers spécifiques à la nuée
  const codeSpécificationNuée = générerCodeSpécificationNuée();
  const codeComposanteAjoutDonnées = 'code composante test';

  // Ajouter les fichiers générés au gabarit
  const adresseDossierUtils = ['packages', 'renderer', 'src', 'utils'];
  const dossierGabaritUtils = adresseDossierUtils.reduce(
    (cumul: JSZip | null, nouveau: string) => (cumul ? cumul.folder(nouveau) : null),
    zipRacineProjet,
  );
  if (!dossierGabaritUtils) throw new Error('Erreur de structure de paquet.');

  dossierGabaritUtils.file('nuée.ts', codeSpécificationNuée);

  const adresseDossierComposantes = ['packages', 'renderer', 'src', 'components'];
  const dossierGabaritComposantes = adresseDossierComposantes.reduce(
    (cumul: JSZip | null, nouveau: string) => (cumul ? cumul.folder(nouveau) : null),
    zipRacineProjet,
  );
  if (!dossierGabaritComposantes) throw new Error('Erreur de structure de paquet.');

  dossierGabaritComposantes.file('AjoutDonnées.vue', codeComposanteAjoutDonnées);

  // Rezipper tout et télécharger
  const contenu = await zipRacineProjet.generateAsync({type: 'blob'});
  enGénération.value = false;

  saveAs(contenu, t('Mon appli.zip'));
};
</script>
