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
        <v-card-title class="d-flex">
          <span>{{ titreCarte }}</span>
          <v-spacer />
          <v-btn
            variant="flat"
            size="small"
            icon="mdi-close"
            @click="fermer"
          />
        </v-card-title>
        <v-card-subtitle> {{ sousTitreCarte }} </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <v-window
          v-model="étape"
          style="overflow-y: scroll"
        >
          <v-window-item :value="0">
            <SelecteurVariable
              :interdites="variablesInterdites"
              @selectionnee="choisirVariable"
            />
          </v-window-item>
          <v-window-item :value="1">
            <v-checkbox></v-checkbox>
          </v-window-item>
          <v-window-item :value="2">
            <v-list>
              <NouvelleRegle
                :source="{
                  type: 'tableau',
                  idTableau,
                }"
                :categorie-variable="catégorieBaseVariableChoisie"
                @sauvegarder="r => ajouterRègle(r)"
              >
                <template #activator="{props: propsActivateurNouvelleRègle}">
                  <v-list-item v-bind="propsActivateurNouvelleRègle">
                    <template #prepend>
                      <v-icon>mdi-plus</v-icon>
                    </template>
                    <v-list-item-title>
                      {{ t('') }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </NouvelleRegle>

              <ItemRegle
                v-for="règle in règlesColonne"
                :key="règle.id"
                :regle="règle"
                effacable
                @effacer="() => effacerRègle(règle.id)"
              />

              <ItemRegle
                v-for="règle in règlesVariable"
                :key="règle.id"
                :regle="règle"
              />
            </v-list>
          </v-window-item>
          <v-window-item :value="3">
            <v-btn
              variant="outlined"
              @click="() => créerColonne()"
            >
              {{ t('') }}
            </v-btn>
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
import type {ClientConstellation} from '@constl/ipa';

import type {types, valid, variables} from '@constl/ipa';

import {computed, inject, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';

import {v4 as uuidv4} from 'uuid';

import {enregistrerÉcoute, enregistrerÉcouteDynamique} from '/@/components/utils';
import SelecteurVariable from '/@/components/variables/SélecteurVariable.vue';

import ItemRegle from '/@/components/règles/ItemRègle.vue';
import NouvelleRegle from '/@/components/règles/NouvelleRègle.vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{
  idTableau?: string;
  idVariable?: string;
  idColonne?: string;
  variablesInterdites?: string[];
}>();

const émettre = defineEmits<{
  (
    é: 'nouvelle',
    info: {
      idVariable: string;
      idColonne?: string;
      index: boolean;
      règles: valid.règleVariableAvecId[];
    },
  ): void;
}>();

const {mdAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const constl = inject<ClientConstellation>('constl');

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = ['variable', 'index', 'règles', 'confirmation'] as const;

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'variable':
      return t('colonnes.nouvelle.titreVariable');
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'variable':
      return t('colonnes.nouvelle.sousTitreVariable');
    default:
      return '';
  }
});

const suivant = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      étape.value++;
      break;
  }
};

const retour = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      étape.value--;
      break;
  }
};

const suivantActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'variable':
      return {actif: !!idVariableChoisie.value, visible: false};
    case 'confirmation':
      return {actif: false, visible: false};
    default:
      return {actif: true, visible: true};
  }
});

const retourActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'variable':
      return {actif: false, visible: false};
    default:
      return {actif: true, visible: true};
  }
});

// Variable
const idVariableChoisie = ref(props.idVariable);
const choisirVariable = (idVar: string) => (idVariableChoisie.value = idVar);

// Catégorie variable
const catégorieBaseVariableChoisie = ref<variables.catégorieBaseVariables>();
let oublierCatégorieVariable: types.schémaFonctionOublier | undefined;
const lancerSuiviCatégorieBaseVariable = async (idVariable?: string) => {
  if (oublierCatégorieVariable) await oublierCatégorieVariable();
  if (idVariable) {
    oublierCatégorieVariable = await enregistrerÉcoute(
      constl?.variables.suivreCatégorieVariable({
        idVariable,
        f: x => (catégorieBaseVariableChoisie.value = x.catégorie),
      }),
    );
  } else {
    catégorieBaseVariableChoisie.value = undefined;
  }
};
watchEffect(async () => {
  await lancerSuiviCatégorieBaseVariable(idVariableChoisie.value);
});

// Index
const index = ref(false);

// Règles variable associée
const règlesVariable = enregistrerÉcouteDynamique({
  params: {id: idVariableChoisie},
  fÉcoute: (params, f: types.schémaFonctionSuivi<valid.règleVariableAvecId[]>) =>
    constl?.variables.suivreRèglesVariable({idVariable: params.id, f}),
});

// Règles colonne
const règlesColonne = ref<valid.règleVariableAvecId[]>([]);

const ajouterRègle = (règle: valid.règleVariable) => {
  const idRègle = uuidv4();
  règlesColonne.value = [...règlesColonne.value, {règle: règle, id: idRègle}];
};
const effacerRègle = (idRègle: string) => {
  règlesColonne.value = règlesColonne.value.filter(r => r.id !== idRègle);
};

// Créer colonne
const prèteÀCréér = computed<{idVariable: string} | undefined>(() => {
  return idVariableChoisie.value ? {idVariable: idVariableChoisie.value} : undefined;
});

const créerColonne = async () => {
  if (!prèteÀCréér.value) return;
  const {idVariable} = prèteÀCréér.value;

  émettre('nouvelle', {
    idVariable,
    index: index.value,
    idColonne: props.idColonne,
    règles: règlesColonne.value,
  });

  fermer();
};

const fermer = () => {
  idVariableChoisie.value = undefined;
  index.value = false;
  règlesColonne.value = [];

  dialogue.value = false;
};
</script>
