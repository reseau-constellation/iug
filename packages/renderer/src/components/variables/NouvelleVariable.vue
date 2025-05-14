<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props}">
      <slot
        name="activateur"
        v-bind="{props}"
      ></slot>
    </template>

    <v-card
      class="mx-auto"
      :min-width="mdAndUp ? 500 : 300"
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
            <v-select
              v-model="catégorieBase"
              class="mt-2"
              :items="catégoriesBase"
              :label="t('variables.nouvelle.catégorie')"
              variant="outlined"
            >
              <template #item="{item, props: propsItem}">
                <v-list-item
                  v-bind="propsItem"
                  :title="t(`variables.catégories.${item.raw}`)"
                  :subtitle="t(`variables.indicesCatégories.${item.raw}`)"
                  :prepend-icon="
                    icôneCatégorieVariable({type: 'simple', catégorie: item.raw}) || 'mdi-variable'
                  "
                />
              </template>
              <template #selection="{item}">
                {{ t(`variables.catégories.${item.raw}`) }}
              </template>
            </v-select>
            <v-checkbox
              v-show="false"
              v-model="catégorieListe"
              :label="t('variables.nouvelle.typeListe')"
              color="primary"
              append-icon="mdi-format-list-bulleted"
            />
          </v-window-item>
          <v-window-item :value="1">
            <liste-noms
              :texte-aucun-nom="t('communs.texteAucunNom')"
              :indice-langue="t('communs.indiceLangue')"
              :etiquette-nom="t('communs.étiquetteNom')"
              :indice-nom="t('variables.nouvelle.texteIndiceNom')"
              :noms-initiaux="noms"
              :autorisation-modification="true"
              @ajuster-noms="ajusterNoms"
            />
          </v-window-item>
          <v-window-item :value="listeÉtapes.indexOf('descriptions')">
            <liste-noms
              :texte-aucun-nom="t('variables.nouvelle.texteAucuneDescription')"
              :indice-langue="t('communs.indiceLangue')"
              :etiquette-nom="t('variables.nouvelle.texteÉtiquetteDescription')"
              :indice-nom="t('variables.nouvelle.texteIndiceDescription')"
              :noms-initiaux="descriptions"
              :autorisation-modification="true"
              longue
              @ajuster-noms="ajusterDescriptions"
            />
          </v-window-item>
          <v-window-item :value="listeÉtapes.indexOf('unités')">
            <v-text-field
              v-model="unités"
              variant="outlined"
            />
          </v-window-item>
          <v-window-item :value="listeÉtapes.indexOf('règles')">
            <NouvelleRegle
              :source="{
                type: 'variable',
              }"
              :categorie-variable="catégorieBase"
              @sauvegarder="r => ajouterRègle(r)"
            >
              <template #activateur="{props: propsActivateurNouvelleRègle}">
                <v-list-item
                  v-bind="propsActivateurNouvelleRègle"
                  prepend-icon="mdi-plus"
                >
                  <v-list-item-title>
                    {{ t('variables.règles.nouvelle') }}
                  </v-list-item-title>
                </v-list-item>
              </template>
            </NouvelleRegle>
            <item-regle
              v-for="r in règles"
              :key="r.id"
              :regle="r"
              effacable
              autorisation-modifier
              @effacer="() => effacerRègle(r.id)"
            ></item-regle>
            <p
              v-if="!règles.length"
              class="my-2 text-center text-disabled"
            >
              {{ t('variables.règles.aucune') }}
            </p>
          </v-window-item>
          <v-window-item :key="listeÉtapes.indexOf('confirmation')">
            <div class="text-center">
              <v-btn
                class="mt-3"
                variant="outlined"
                :loading="enCréation"
                @click="() => créerVariable()"
              >
                {{ t('variables.nouvelle.texteBtnCréation') }}
              </v-btn>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>
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
import type {valid, variables} from '@constl/ipa';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import BtnRetour from '/@/components/communs/BtnRetour.vue';
import BtnSuivant from '/@/components/communs/BtnSuivant.vue';
import ListeNoms from '/@/components/communs/listeNoms/ListeNoms.vue';
import ItemRegle from '/@/components/règles/ItemRègle.vue';
import NouvelleRegle from '/@/components/règles/NouvelleRègle.vue';

import {v4 as uuidv4} from 'uuid';
import {icôneCatégorieVariable} from '/@/components/variables/utils';

import {utiliserConstellation} from '../utils';
import {catégoriesBase} from './utils';

const émettre = defineEmits<{(é: 'nouvelle', id: string): void}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = [
  'catégorie',
  'noms',
  'descriptions',
  'unités',
  'règles',
  'confirmation',
] as const;

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'catégorie':
      return 'variables.nouvelle.titreCatégorie';
    case 'noms':
      return 'variables.nouvelle.titreNoms';
    case 'descriptions':
      return 'variables.nouvelle.titreDescriptions';
    case 'unités':
      return 'variables.nouvelle.titreUnités';
    case 'règles':
      return 'variables.nouvelle.titreRègles';
    case 'confirmation':
      return 'variables.nouvelle.titreConfirmation';
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'catégorie':
      return 'variables.nouvelle.sousTitreCatégorie';
    case 'noms':
      return 'variables.nouvelle.sousTitreNoms';
    case 'descriptions':
      return 'variables.nouvelle.sousTitreDescriptions';
    case 'unités':
      return 'variables.nouvelle.sousTitreUnités';
    case 'règles':
      return 'variables.nouvelle.sousTitreRègles';
    case 'confirmation':
      return 'variables.nouvelle.sousTitreConfirmation';
    default:
      return '';
  }
});

const retour = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'règles':
      étape.value = listeÉtapes.indexOf(unitésPossible.value ? 'unités' : 'descriptions');
      break;
    default:
      étape.value--;
      break;
  }
};

const suivant = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'descriptions':
      étape.value = listeÉtapes.indexOf(unitésPossible.value ? 'unités' : 'règles');
      break;
    default:
      étape.value++;
      break;
  }
};

const suivantActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'catégorie':
      return {actif: !!catégorieBase.value, visible: true};
    case 'noms':
      return {actif: !!Object.keys(noms.value).length, visible: true};
    case 'confirmation':
      return {actif: false, visible: false};
    default:
      return {actif: true, visible: true};
  }
});

const retourActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'catégorie':
      return {actif: false, visible: false};
    case 'confirmation':
      return {actif: !enCréation.value, visible: true};
    default:
      return {actif: true, visible: true};
  }
});

// Catégorie
const catégorieListe = ref(false);
const catégorieBase = ref<variables.catégorieBaseVariables>();
const catégorie = computed<variables.catégorieVariables | undefined>(() => {
  if (!catégorieBase.value) return;
  return {type: catégorieListe.value ? 'liste' : 'simple', catégorie: catégorieBase.value};
});

// Noms
const noms = ref<{[lng: string]: string}>({});
const ajusterNoms = (nms: {[lng: string]: string}) => {
  noms.value = nms;
};

// Descriptions
const descriptions = ref<{[lng: string]: string}>({});
const ajusterDescriptions = (desrc: {[lng: string]: string}) => {
  descriptions.value = desrc;
};

// Unités
const unités = ref<string>();
const unitésPossible = computed(() => {
  return catégorieBase.value === 'numérique';
});

// Règles
const règles = ref<valid.règleVariableAvecId[]>([]);
const ajouterRègle = (règle: valid.règleVariable) => {
  règles.value = [
    ...règles.value,
    {
      règle,
      id: uuidv4(),
    },
  ];
};
const effacerRègle = (id: string) => {
  règles.value = règles.value.filter(r => r.id !== id);
};

// Création
const enCréation = ref(false);
const créerVariable = async () => {
  enCréation.value = true;

  if (!catégorie.value) return;

  const idVariable = await constl.variables.créerVariable({catégorie: catégorie.value});

  const promesses: Promise<unknown>[] = [
    constl.variables.sauvegarderNomsVariable({
      idVariable,
      noms: Object.fromEntries(Object.entries(noms.value)),
    }),
    constl.variables.sauvegarderDescriptionsVariable({
      idVariable,
      descriptions: Object.fromEntries(Object.entries(descriptions.value)),
    }),
    ...règles.value.map(r =>
      constl.variables.ajouterRègleVariable({
        idVariable,
        règle: r.règle,
      }),
    ),
  ];

  if (unités.value) {
    promesses.push(constl.variables.sauvegarderUnitésVariable({idVariable, idUnité: unités.value}));
  }

  émettre('nouvelle', idVariable);

  fermer();
};

// Fermer
const fermer = () => {
  catégorieBase.value = undefined;
  catégorieListe.value = false;
  noms.value = {};
  descriptions.value = {};
  étape.value = 0;
  enCréation.value = false;
  dialogue.value = false;
};
</script>
