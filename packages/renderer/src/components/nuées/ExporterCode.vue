<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsComposante}">
      <slot
        name="activator"
        v-bind="{propsComposante}"
      ></slot>

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

              <v-text-field readonly>{{ installation }}</v-text-field>
              <v-textarea readonly>{{ code }}</v-textarea>
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
    </template>
  </v-dialog>
</template>
<script setup lang="ts">
import {computed, inject, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import type {MandataireClientConstellation} from '@constl/mandataire';


import type {bds} from '@constl/ipa';
import DialogueLicence from '/@/components/licences/DialogueLicence.vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {GABARIT_CODE} from '/@/consts';

import axios from 'axios';
import JSZip from 'jszip';
import {fileSave} from 'browser-fs-access';

const constl = inject<MandataireClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {langue} = utiliserLangues();
const {t} = useI18n();

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
      return t('nuées.générerCode.titrePrésentation');
    case 'licenceParDéfaut':
      return t('nuées.générerCode.titreLicenceParDéfaut');
    case 'bdPrincipale':
      return t('nuées.générerCode.titreBdPrincipale');
    case 'codeGénéré':
      return t('nuées.générerCode.titreCodeGénéré');
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'présentation':
      return t('nuées.générerCode.sousTitrePrésentation');
    case 'licenceParDéfaut':
      return t('nuées.générerCode.sousTitreLicenceParDéfaut');
    case 'bdPrincipale':
      return t('nuées.générerCode.sousTitreBdPrincipale');
    case 'codeGénéré':
      return t('nuées.générerCode.sousTitreCodeGénéré');
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

// Spécifications nuée
const clefTableauNuée = ref<string>();
const schémaSpécificationBdsNuée = ref<bds.schémaSpécificationBd>();

watchEffect(async () => {
  schémaSpécificationBdsNuée.value = await constl?.nuées.générerSchémaBdNuée({
    idNuée: props.idNuee,
    licence: licenceDéfaut.value,
  });
});

const tableaux = computed(() => {
  return schémaSpécificationBdsNuée.value?.tableaux;
});

// Options
const langagesSupportés = ['ts', 'js'] as const;
const langage = ref<(typeof langagesSupportés)[number]>('ts');

const langueCode = ref<string>(langue.value);

const licenceDéfaut = ref('ODbl-1_0');
const motsClefNuée = ref<string[]>([]);
const bdPrincipale = ref<string>();

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
  return `
pnpm install @constl/ipa ${bdPrincipale.value ? '@lassi-js/kili' : ''}
`;
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
    c => '[codeColonne' + c.idColonne + ']' + (c.optionnel ? '?' : '') + ': string;',
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

const générerCodeComposanteAjoutDonnées = (): string => {
  return `
<template>
  <v-dialog>
    
    <v-card>
      <v-card-item>
        <v-card-title>
        </v-card-title>
      </v-card-item>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";

<+/script>
`.replace('+/', '/'); // Pour éviter problème eslint la clôture du <script>
};

const électron = ref(false);

const générerPaquetComplet = async (): Promise<void> => {
  // Télécharger gabarit correspondant de GitHub
  const racineGabarit = (await axios.get(GABARIT_CODE, {responseType: 'arraybuffer'})).data;
  const zipRacineGabarit = await JSZip.loadAsync(racineGabarit);
  const gabarit = zipRacineGabarit
    .folder('paquets')
    ?.folder(électron.value ? 'électron' : 'navigateur');
  if (!gabarit) throw new Error('Erreur de structure de paquet.');

  // Générer les fichiers spécifiques à la nuée
  const codeSpécificationNuée = générerCodeSpécificationNuée();
  const codeComposanteAjoutDonnées = générerCodeComposanteAjoutDonnées();

  // Ajouter les fichiers générés au gabarit
  const adresseDossierUtils = électron.value
    ? ['packages', 'renderer', 'src', 'utils']
    : ['src', 'utils'];
  const dossierGabaritUtils = adresseDossierUtils.reduce(
    (cumul: JSZip | null, nouveau: string) => (cumul ? cumul.folder(nouveau) : null),
    gabarit,
  );
  if (!dossierGabaritUtils) throw new Error('Erreur de structure de paquet.');

  dossierGabaritUtils.file('nuée.ts', codeSpécificationNuée);

  const adresseDossierComposantes = électron.value
    ? ['packages', 'renderer', 'src', 'components']
    : ['src', 'components'];
  const dossierGabaritComposantes = adresseDossierComposantes.reduce(
    (cumul: JSZip | null, nouveau: string) => (cumul ? cumul.folder(nouveau) : null),
    gabarit,
  );
  if (!dossierGabaritComposantes) throw new Error('Erreur de structure de paquet.');

  dossierGabaritComposantes.file('AjoutDonnées.vue', codeComposanteAjoutDonnées);

  // Rezipper tout et télécharger
  const contenu = await gabarit.generateAsync({type: 'blob'});
  await fileSave(contenu, {fileName: 'Mon appli.zip'});
};
</script>
