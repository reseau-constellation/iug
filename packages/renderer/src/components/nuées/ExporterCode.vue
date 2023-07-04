<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsComposante}">
      <slot
        name="activator"
        v-bind="{propsComposante}"
      ></slot>

      <v-card
        class="mx-auto"
        :width="mdAndUp ? 500 : 300"
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
              <v-select
                v-model="langage"
                :items="itemsLangages"
              />
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
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-card-actions> </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
<script setup lang="ts">
import {computed, inject, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import type {client} from '@constl/ipa';

import type {bds} from '@constl/ipa';
import DialogueLicence from '/@/components/licences/DialogueLicence.vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {langue} = utiliserLangues();
const {t} = useI18n();

const props = defineProps<{idNuee: string}>();
const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = [
  'langageInformatique',
  'licenceParDéfaut',
  'bdPrincipale',
  'codeGénéré',
] as const;

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'langageInformatique':
      return t('nuées.générerCode.titrelangageInformatique');
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
    case 'langageInformatique':
      return t('nuées.générerCode.sousTitrelangageInformatique');
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

// Spécifications nuée
const clefTableauNuée = ref<string>();
const schémaSpécificationBdsNuée = ref<bds.schémaSpécificationBd>();

watchEffect(async () => {
  schémaSpécificationBdsNuée.value = await constl?.nuées?.générerSchémaBdNuée({
    idNuée: props.idNuee,
    licence: licenceDéfaut.value,
  });
});

const tableaux = computed(() => {
  return schémaSpécificationBdsNuée.value?.tableaux;
});

// Options
const langagesSupportés = ['ts', 'js'] as const;
const langage = ref<typeof langagesSupportés[number]>('ts');
const itemsLangages = computed(() => {
  return langagesSupportés.map(l => ({
    value: l,
    title: t(`communs.langagesInformatiques.${l}.abr`),
  }));
});
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
</script>
