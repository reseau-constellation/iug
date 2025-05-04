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
      :min-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex align-center">
          <span>{{ t(titreCarte) }}</span>
          <v-spacer />
          <v-btn
            variant="flat"
            size="small"
            icon="mdi-close"
            @click="fermer"
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
            <SelecteurVariable
              :interdites="variablesInterdites"
              :multiples="false"
              @selectionnee="ids => choisirVariable(ids[0])"
            />
          </v-window-item>
          <v-window-item :value="1">
            <v-checkbox
              v-model="index"
              :label="t('colonnes.nouvelle.index')"
              color="primary"
            ></v-checkbox>
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
                  <v-list-item
                    v-bind="propsActivateurNouvelleRègle"
                    prepend-icon="mdi-plus"
                  >
                    <v-list-item-title>
                      {{ t('tableaux.règles.nouvelle') }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </NouvelleRegle>

              <item-regle-colonne
                v-for="règle in règlesExistantes"
                :key="règle.règle.id"
                :regle="règle"
                :effacable="false"
                :autorisation-modifier="false"
              />

              <item-regle
                v-for="règle in règlesColonne"
                :key="règle.id"
                :regle="règle"
                effacable
                :autorisation-modifier="true"
                @effacer="() => effacerRègle(règle.id)"
              />
            </v-list>
          </v-window-item>
          <v-window-item
            :value="3"
            class="text-center"
          >
            <v-btn
              variant="outlined"
              @click="() => créerColonne()"
            >
              {{ t('colonnes.nouvelle.texteBtnCréation') }}
            </v-btn>
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
import type {valid} from '@constl/ipa';

import {suivre} from '@constl/vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {v4 as uuidv4} from 'uuid';

import {utiliserConstellation} from '/@/components/utils';
import SelecteurVariable from '/@/components/variables/SélecteurVariable.vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import BtnRetour from '/@/components/communs/BtnRetour.vue';
import BtnSuivant from '/@/components/communs/BtnSuivant.vue';
import ItemRegle from '/@/components/règles/ItemRègle.vue';
import ItemRegleColonne from '/@/components/règles/ItemRègleColonne.vue';
import NouvelleRegle from '/@/components/règles/NouvelleRègle.vue';

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
      règles: valid.règleVariable[];
    },
  ): void;
}>();

const {mdAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = ['variable', 'index', 'règles', 'confirmation'] as const;

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'variable':
      return 'colonnes.nouvelle.titreVariable';
    case 'index':
      return 'colonnes.nouvelle.titreIndex';
    case 'règles':
      return 'colonnes.nouvelle.titreRègles';
    case 'confirmation':
      return 'colonnes.nouvelle.titreConfirmation';
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'variable':
      return 'colonnes.nouvelle.sousTitreVariable';
    case 'index':
      return 'colonnes.nouvelle.sousTitreIndex';
    case 'règles':
      return 'colonnes.nouvelle.sousTitreRègles';
    case 'confirmation':
      return 'colonnes.nouvelle.sousTitreConfirmation';
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
      return {actif: !!idVariableChoisie.value, visible: true};
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
const catégorieVariableChoisie = suivre(constl.variables.suivreCatégorieVariable, {
  idVariable: idVariableChoisie,
});
const catégorieBaseVariableChoisie = computed(() => catégorieVariableChoisie.value?.catégorie);

// Index
const index = ref(false);

// Règles variable associée
const règlesVariable = suivre(constl.variables.suivreRèglesVariable, {
  idVariable: idVariableChoisie,
});
const règlesExistantes = computed<valid.règleColonne[] | undefined>(() => {
  const idVariable = idVariableChoisie.value;
  if (!idVariable) return undefined;
  return règlesVariable.value?.map(r => ({
    règle: r,
    source: {type: 'variable', id: idVariable},
    colonne: '',
  }),
  );
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
    règles: règlesColonne.value.map(r => r.règle),
  });

  fermer();
};

const fermer = () => {
  idVariableChoisie.value = undefined;
  index.value = false;
  règlesColonne.value = [];

  dialogue.value = false;
  étape.value = 0;
};
</script>
