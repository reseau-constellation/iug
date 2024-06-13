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
        <v-card-title>{{ t('colonnes.carte.titre') }}</v-card-title>
      </v-card-item>
      <v-card-text style="overflow-y:auto">
        <division-carte
          :titre="t('colonnes.variable')"
          :en-attente="!règlesÀAfficher"
        />
        <selecteur-variable
          :multiples="false"
          :originales="[idVariable]"
          @selectionnee="ids => (choixVariable = ids[0])"
        />
        <v-checkbox
          v-model="choixIndex"
          :disabled="!permissionModifier"
          color="primary"
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
        <division-carte
          :titre="t('colonnes.règles')"
          :en-attente="!règlesÀAfficher"
        />
        <v-list>
          <item-regle-colonne
            v-for="r in règlesÀAfficher"
            :key="r.règle.id"
            :regle="r"
            @effacer="() => effacerRègle(r.règle.id)"
          ></item-regle-colonne>
          <v-divider class="mt-2" />
          <nouvelle-regle
            v-if="permissionModifier"
            :source="{
              type: 'variable',
            }"
            :categorie-variable="catégorieBaseVariable"
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
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="!modifié"
          variant="flat"
          color="primary"
          @click="sauvegarder"
        >
          {{ t('communs.sauvegarder') }}
        </v-btn>
        <v-btn
          variant="flat"
          append-icon="mdi-close"
          @click="fermer"
        >
          {{ t('communs.fermer') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {valid} from '@constl/ipa';

import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';
import {v4 as uuidv4} from 'uuid';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import SelecteurVariable from '/@/components/variables/SélecteurVariable.vue';
import NouvelleRegle from '/@/components/règles/NouvelleRègle.vue';
import ItemRegleColonne from '/@/components/règles/ItemRègleColonne.vue';
import DivisionCarte from '/@/components/communs/DivisionCarte.vue';

import {constellation, suivre} from '../utils';

const props = defineProps<{
  permissionModifier: boolean;
  idVariable: string;
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
      variable: string;
      règles: {
        nouvelles: valid.règleVariable[];
        àEffacer: string[];
      };
    },
  ): void;
}>();

const {mdAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = constellation();

// Navigation
const dialogue = ref(false);

// Index
const choixIndex = ref(props.index);
const indexModifié = computed(() => choixIndex.value !== props.index);

// Variable
const choixVariable = ref(props.idVariable);
const variableModifiée = computed(() => choixVariable.value !== props.idVariable);
const catégorieVariable = suivre(constl.variables.suivreCatégorieVariable, {
  idVariable: choixVariable.value,
});
const catégorieBaseVariable = computed(() => {
  return catégorieVariable.value?.catégorie;
});

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
  return nouvellesRègles.value.length || règlesÀEffacer.value.length;
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
