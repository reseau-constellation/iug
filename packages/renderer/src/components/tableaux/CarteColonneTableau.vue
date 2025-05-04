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
      <v-card-item class="mb-0">
        <v-card-title class="d-flex align-center align-center">
          {{ t('colonnes.carte.titre') }}
          <lien-objet :id="idColonne" />
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          ></v-btn>
        </v-card-title>
      </v-card-item>
      <v-divider />
      <v-card-text style="overflow-y: auto">
        <division-carte
          :titre="t('colonnes.carte.variable')"
          :en-attente="!règlesÀAfficher"
        />
        <selecteur-variable
          v-if="permissionModifier"
          :multiples="false"
          :originales="idVariable ? [idVariable] : undefined"
          @selectionnee="ids => choisirVariable({idVar: ids[0]})"
        />
        <jeton-variable
          v-else-if="idVariable"
          :id="idVariable"
        />

        <division-carte
          :titre="t('colonnes.carte.règles')"
          :en-attente="!règlesÀAfficher"
        />
        <v-list>
          <nouvelle-regle
            v-if="permissionModifier"
            :source="{
              type: 'tableau',
              idTableau,
              idColonne,
              idVariable: choixVariable,
            }"
            :categorie-variable="catégorieBaseVariable"
            :existantes="
              règlesÀAfficher.filter(r => r.source.type === 'tableau').map(r => r.règle.règle)
            "
            @sauvegarder="r => ajouterRègle(r)"
          >
            <template #activator="{props: propsActivateurNouvelleRègle}">
              <v-list-item
                v-bind="propsActivateurNouvelleRègle"
                prepend-icon="mdi-plus"
              >
                <v-list-item-title>
                  {{ t('variables.règles.nouvelle') }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </nouvelle-regle>
          <item-regle-colonne
            v-for="r in règlesÀAfficher"
            :key="r.règle.id"
            :regle="r"
            :autorisation-modifier="permissionModifier"
            @effacer="() => effacerRègle(r.règle.id)"
          ></item-regle-colonne>
        </v-list>
        <division-carte
          :titre="t('colonnes.carte.avancées')"
          :en-attente="!règlesÀAfficher"
        />
        <v-checkbox
          v-model="choixIndex"
          :disabled="!permissionModifier"
          color="primary"
          hide-details
        >
          <template #label>
            {{ t('colonnes.nouvelle.index') }}
            <v-tooltip :text="t('tableaux.colonnes.indiceIndex')">
              <template #activator="{props: propsActivateur}">
                <v-icon
                  v-bind="propsActivateur"
                  icon="mdi-information-outline"
                  end
                />
              </template>
            </v-tooltip>
          </template>
        </v-checkbox>
        <v-dialog v-model="dialogueEffacer">
          <template #activator="{props: propsActivateur}">
            <v-list-item
              v-bind="propsActivateur"
              class="text-error"
              variant="flat"
              append-icon="mdi-delete"
            >
              {{ t('communs.effacer') }}
            </v-list-item>
          </template>
          <v-card
            class="mx-auto"
            max-width="300"
          >
            <v-card-item>
              <p class="text-h5">
                {{ t('tableaux.colonnes.confirmerEffacer') }}
              </p>
            </v-card-item>
            <v-card-actions>
              <v-btn @click="dialogueEffacer = false">{{ t('communs.non') }}</v-btn>
              <v-btn
                color="error"
                @click="() => émettre('effacer')"
              >
                {{ t('communs.oui') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <btn-sauvegarder
          :actif="modifié"
          @click="sauvegarder"
        />
        <btn-annuler @click="fermer" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {valid} from '@constl/ipa';

import {suivre} from '@constl/vue';
import {v4 as uuidv4} from 'uuid';
import {computed, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import BtnAnnuler from '/@/components/communs/BtnAnnuler.vue';
import BtnSauvegarder from '/@/components/communs/BtnSauvegarder.vue';
import DivisionCarte from '/@/components/communs/DivisionCarte.vue';
import LienObjet from '/@/components/communs/LienObjet.vue';
import ItemRegleColonne from '/@/components/règles/ItemRègleColonne.vue';
import NouvelleRegle from '/@/components/règles/NouvelleRègle.vue';
import JetonVariable from '/@/components/variables/JetonVariable.vue';
import SelecteurVariable from '/@/components/variables/SélecteurVariable.vue';

import {utiliserConstellation} from '../utils';

const props = defineProps<{
  permissionModifier: boolean;
  idVariable?: string;
  idColonne: string;
  idTableau: string;
  regles?: valid.règleColonne[];
  index: boolean;
}>();
const émettre = defineEmits<{
  (
    é: 'sauvegarder',
    args: {
      index: boolean;
      variable?: string;
      règles: {
        nouvelles: valid.règleVariable[];
        àEffacer: string[];
      };
    },
  ): void;
  (é: 'effacer'): void;
}>();

const {mdAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);
const dialogueEffacer = ref(false);

// Index
const choixIndex = ref(props.index);
const indexModifié = computed(() => choixIndex.value !== props.index);

// Variable
const choixVariable = ref(props.idVariable);
watchEffect(() => (choixVariable.value = props.idVariable));

const variableModifiée = computed(() => choixVariable.value !== props.idVariable);
const catégorieVariable = suivre(constl.variables.suivreCatégorieVariable, {
  idVariable: choixVariable,
});
const catégorieBaseVariable = computed(() => {
  return catégorieVariable.value?.catégorie;
});
const choisirVariable = ({idVar}: {idVar: string}) => {
  choixVariable.value = idVar;
};

// Règles
const nouvellesRègles = ref<valid.règleVariableAvecId[]>([]);
const règlesÀEffacer = ref<string[]>([]);

const règlesÀAfficher = computed<valid.règleColonne[]>(() => {
  const nouvelles: valid.règleColonne[] = nouvellesRègles.value.map(r => ({
    règle: r,
    source: {
      type: 'tableau',
      id: props.idTableau,
    },
    colonne: props.idColonne,
  }));
  return [...(props.regles || []), ...nouvelles].filter(
    r => !règlesÀEffacer.value.includes(r.règle.id),
  );
});

const effacerRègle = (id: string) => {
  if (règlesÀEffacer.value.includes(id)) return;
  if (nouvellesRègles.value?.some(r => r.id === id)) {
    nouvellesRègles.value = nouvellesRègles.value?.filter(r => r.id !== id);
  } else if (props.regles?.some(r => r.règle.id === id)) {
    règlesÀEffacer.value = [id, ...règlesÀEffacer.value];
  }
};
const ajouterRègle = (r: valid.règleVariable) => {
  nouvellesRègles.value = [{règle: r, id: uuidv4()}, ...(nouvellesRègles.value || [])];
};

const règlesModifiées = computed(() => {
  return !!(nouvellesRègles.value.length || règlesÀEffacer.value.length);
});

// Sauvegarder
const modifié = computed(() => {
  return indexModifié.value || variableModifiée.value || règlesModifiées.value;
});
const sauvegarder = () => {
  émettre('sauvegarder', {
    index: choixIndex.value,
    variable: choixVariable.value,
    règles: {
      nouvelles: nouvellesRègles.value.map(r => r.règle),
      àEffacer: règlesÀEffacer.value,
    },
  });
  fermer();
};
const fermer = () => {
  dialogue.value = false;
  nouvellesRègles.value = [];
  règlesÀEffacer.value = [];
};
</script>
