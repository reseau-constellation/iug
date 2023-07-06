<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
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
              <SélecteurVariable
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
                    idTableau: idTableau,
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

                <ItemRègle
                  v-for="règle in règlesColonne"
                  :key="règle.id"
                  :regle="règle"
                  effacable
                  @effacer="() => effacerRègle(règle.id)"
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
    </template>
  </v-dialog>
</template>
<script setup lang="ts">
import type {client} from '@constl/ipa';
import type {utils, valid, variables} from '@constl/ipa';

import {computed, inject, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';

import {v4 as uuidv4} from 'uuid';

import {enregistrerÉcoute} from '/@/components/utils';

import ItemRègle from '/@/components/règles/ItemRègle.vue';
import NouvelleRegle from '/@/components/règles/NouvelleRègle.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const props = defineProps<{
  idTableau: string;
  idVariable?: string;
  idColonne?: string;
  variablesInterdites?: string[];
}>();

const {mdAndUp} = useDisplay();
const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const constl = inject<client.ClientConstellation>('constl');

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = ['Variable', 'Index', 'Règles', 'Confirmation'] as const;

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
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
    case 'Variable':
      return {actif: !!idVariableChoisie.value, visible: false};
    case 'Confirmation':
      return {actif: false, visible: false};
    default:
      return {actif: true, visible: true};
  }
});

const retourActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'Variable':
      return {actif: false, visible: false};
    case 'Confirmation':
      return {actif: !enCréation.value, visible: true};
    default:
      return {actif: true, visible: true};
  }
});

// Variable
const idVariableChoisie = ref(props.idVariable);
const choisirVariable = (idVar: string) => (idVariableChoisie.value = idVar);

// Catégorie variable
const catégorieBaseVariableChoisie = ref<variables.catégorieBaseVariables>();
let oublierCatégorieVariable: utils.schémaFonctionOublier | undefined;
const lancerSuiviCatégorieBaseVariable = async (idVariable?: string) => {
  if (oublierCatégorieVariable) await oublierCatégorieVariable();
  if (idVariable) {
    oublierCatégorieVariable = await enregistrerÉcoute(
      constl?.variables?.suivreCatégorieVariable({
        id: idVariable,
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
const règlesVariable = ref<valid.règleVariableAvecId[]>();
let oublierRèglesVariables: utils.schémaFonctionOublier | undefined;

const lancerSuiviRèglesVariables = async (idVariable?: string) => {
  if (oublierRèglesVariables) await oublierRèglesVariables();
  if (idVariable) {
    oublierRèglesVariables = await enregistrerÉcoute(
      constl?.variables?.suivreRèglesVariable({
        id: idVariable,
        f: x => (règlesVariable.value = x),
      }),
    );
  } else {
    règlesVariable.value = undefined;
  }
};

watchEffect(async () => {
  await lancerSuiviRèglesVariables(idVariableChoisie.value);
});

// Règles colonne
const règlesColonne = ref<valid.règleVariableAvecId[]>([]);

const ajouterRègle = (règle: valid.règleVariable) => {
  const idRègle = uuidv4();
  // @ts-expect-error  À vérifier éventuellement
  règlesColonne.value = [...règlesColonne.value, {règle: règle, id: idRègle}];
};
const effacerRègle = (idRègle: string) => {
  règlesColonne.value = règlesColonne.value.filter(r => r.id !== idRègle);
};

// Créer colonne
const enCréation = ref(false);
const prèteÀCréér = computed<{idVariable: string} | undefined>(() => {
  return idVariableChoisie.value ? {idVariable: idVariableChoisie.value} : undefined;
});

const créerColonne = async () => {
  if (!prèteÀCréér.value) return;
  const {idVariable} = prèteÀCréér.value;

  enCréation.value = true;

  const idColonne = await constl?.tableaux?.ajouterColonneTableau({
    idTableau: props.idTableau,
    idVariable: idVariable,
    idColonne: props.idColonne,
  });

  if (index.value && idColonne) {
    await constl?.tableaux?.changerColIndex({
      idTableau: props.idTableau,
      idColonne,
      val: true,
    });
  }
  if (idColonne) {
    for (const règle of règlesColonne.value) {
      await constl?.tableaux?.ajouterRègleTableau({
        idTableau: props.idTableau,
        idColonne: idColonne,
        règle: règle.règle,
      });
    }
  }

  enCréation.value = false;
  dialogue.value = false;
};
</script>
