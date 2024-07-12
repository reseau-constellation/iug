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
            <div class="text-center">
              <v-btn
                class="ma-3"
                variant="flat"
                color="primary"
                @click="() => suivreCheminementRègleExiste()"
              >
                {{ t('règles.types.existe') }}
              </v-btn>
              <v-btn
                v-if="règleBornePossible"
                class="ma-3"
                variant="outlined"
                @click="() => suivreCheminementRègleBorne()"
              >
                {{ t('règles.types.borne') }}
              </v-btn>
              <v-btn
                v-if="false"
                class="ma-3"
                variant="outlined"
                @click="() => suivreCheminementRègleCatégorique()"
              >
                {{ t('règles.types.catégorique') }}
              </v-btn>
            </div>
          </v-window-item>
          <v-window-item :value="1">
            <v-btn
              class="ma-3"
              variant="outlined"
              @click="() => utiliserBorne('fixe')"
            >
              {{ t('règles.nouvelle.borneFixe') }}
            </v-btn>
            <v-btn
              class="ma-3"
              variant="outlined"
              @click="() => utiliserBorne('dynamiqueVariable')"
            >
              {{ t('règles.nouvelle.borneDynamiqueVariable') }}
            </v-btn>
            <v-btn
              v-if="idTableauPourRègle"
              class="ma-3"
              variant="outlined"
              @click="() => utiliserBorne('dynamiqueColonne')"
            >
              {{ t('règles.nouvelle.borneDynamiqueColonne') }}
            </v-btn>
          </v-window-item>
          <v-window-item :value="2">
            <v-select
              v-model="opBorne"
              :items="['>', '>=', '<', '<=']"
              variant="outlined"
            />
            <v-text-field
              v-if="typeBornes === 'fixe'"
              v-model="valBorneFixe"
              variant="outlined"
            />
            <SelecteurVariable
              v-else-if="typeBornes === 'dynamiqueVariable'"
              :multiples="false"
              @selectionnee="x => (valBorneDynamiqueVariable = x)"
            />
            <SelecteurColonne
              v-else-if="typeBornes === 'dynamiqueColonne'"
              :id-tableau="idTableauPourRègle"
              :tableau-changeable="false"
              @selectionnee="x => (valBorneDynamiqueColonne = x.idColonne)"
            />
          </v-window-item>
          <v-window-item :value="3">
            <v-btn
              class="ma-3"
              variant="outlined"
              @click="() => utiliserCatégorie('fixe')"
            >
              {{ t('règles.nouvelle.catégoriesFixes') }}
            </v-btn>
            <v-btn
              class="ma-3"
              variant="outlined"
              :disabled="!idTableauPourRègle"
              @click="() => utiliserCatégorie('dynamique')"
            >
              {{ t('règles.nouvelle.catégoriesDynamique') }}
            </v-btn>
          </v-window-item>
          <v-window-item :value="4">
            <v-combobox
              v-if="typeCatégorie === 'fixe'"
              v-model="valCatégorieFixe"
              multiple
              chips
              clearable
            />
            <SelecteurColonne
              v-else
              :id-tableau="idTableauPourRègle"
              :tableau-changeable="true"
              @selectionnee="
                x => (valCatégorieDynamique = {tableau: x.idTableau, colonne: x.idColonne})
              "
            />
          </v-window-item>
          <v-window-item :value="5">
            <div class="text-center">
              <v-btn
                class="mt-3"
                variant="outlined"
                @click="() => confirmer()"
              >
                {{ t('règles.nouvelle.confirmer') }}
              </v-btn>
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
import type {valid, variables} from '@constl/ipa';

import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import SelecteurColonne from '/@/components/tableaux/SélecteurColonne.vue';
import SelecteurVariable from '/@/components/variables/SélecteurVariable.vue';

const props = defineProps<{
  source:
    | {type: 'variable'; idVariable?: string}
    | {type: 'tableau'; idTableau?: string; idColonne?: string};
  categorieVariable?: variables.catégorieBaseVariables;
}>();
const émettre = defineEmits<{
  (é: 'sauvegarder', règle: valid.règleVariable): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);
const étape = ref(0);

const listeÉtapes = [
  'TypeRègle',
  'BorneFixeOuDynamique',
  'ValeurBorne',
  'CatégorieFixeOuDynamique',
  'ValeurCatégorie',
  'Confirmer',
] as const;
const cheminement = ref<'existe' | 'borne' | 'catégorique'>();
const suivreCheminementRègleExiste = () => {
  cheminement.value = 'existe';
  étape.value = listeÉtapes.indexOf('Confirmer');
};
const suivreCheminementRègleBorne = () => {
  cheminement.value = 'borne';
  étape.value = listeÉtapes.indexOf('BorneFixeOuDynamique');
};
const suivreCheminementRègleCatégorique = () => {
  cheminement.value = 'catégorique';
  étape.value = listeÉtapes.indexOf('CatégorieFixeOuDynamique');
};

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'BorneFixeOuDynamique':
      return 'règles.nouvelle.titreBorneFixeOuDynamique';
    case 'CatégorieFixeOuDynamique':
      return 'règles.nouvelle.titreCatégorieFixeOuDynamique';
    case 'TypeRègle':
      return 'règles.nouvelle.titreTypeRègle';
    case 'Confirmer':
      return 'règles.nouvelle.titreConfirmer';
    case 'ValeurBorne':
      return 'règles.nouvelle.titreValeurBorne';
    case 'ValeurCatégorie':
      return 'règles.nouvelle.titreValeurCatégorie';
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'BorneFixeOuDynamique':
      return 'règles.nouvelle.sousTitreBorneFixeOuDynamique';
    case 'CatégorieFixeOuDynamique':
      return 'règles.nouvelle.sousTitreCatégorieFixeOuDynamique';
    case 'TypeRègle':
      return 'règles.nouvelle.sousTitreTypeRègle';
    case 'Confirmer':
      return 'règles.nouvelle.sousTitreConfirmer';
    case 'ValeurBorne':
      return 'règles.nouvelle.sousTitreValeurBorne';
    case 'ValeurCatégorie':
      return 'règles.nouvelle.sousTitreValeurCatégorie';
    default:
      return '';
  }
});

const suivant = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'ValeurBorne':
      étape.value = listeÉtapes.indexOf('Confirmer');
      break;

    case 'ValeurCatégorie':
      étape.value = listeÉtapes.indexOf('Confirmer');
      break;

    default:
      étape.value++;
      break;
  }
};

const retour = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'BorneFixeOuDynamique':
      étape.value = listeÉtapes.indexOf('TypeRègle');
      break;

    case 'CatégorieFixeOuDynamique':
      étape.value = listeÉtapes.indexOf('TypeRègle');
      break;

    case 'Confirmer':
      étape.value = listeÉtapes.indexOf(
        cheminement.value === 'existe'
          ? 'TypeRègle'
          : cheminement.value === 'borne'
            ? 'BorneFixeOuDynamique'
            : 'CatégorieFixeOuDynamique',
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
    case 'TypeRègle':
      return {actif: false, visible: false};
    case 'BorneFixeOuDynamique':
      return {actif: !!typeBornes.value, visible: true};
    case 'CatégorieFixeOuDynamique':
      return {actif: !!typeCatégorie.value, visible: true};
    case 'ValeurBorne':
      return {
        actif:
          !!opBorne.value &&
          !!(typeBornes.value === 'fixe'
            ? valBorneFixe.value
            : typeBornes.value === 'dynamiqueColonne'
              ? valBorneDynamiqueColonne.value
              : valBorneDynamiqueVariable.value?.length),
        visible: true,
      };
    case 'ValeurCatégorie':
      return {
        actif:
          typeCatégorie.value === 'fixe' ? !!valCatégorieFixe.value : !!valCatégorieDynamique.value,
        visible: false,
      };
    case 'Confirmer':
      return {actif: false, visible: false};
    default:
      return {actif: true, visible: true};
  }
});

const retourActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'TypeRègle':
      return {actif: false, visible: false};
    default:
      return {actif: true, visible: true};
  }
});

// Id tableau, s'il existe
const idTableauPourRègle = computed(() => {
  return props.source.type === 'tableau' ? props.source.idTableau : undefined;
});

// Règle bornes
const règleBornePossible = computed(
  () => props.categorieVariable === 'numérique' || props.categorieVariable === 'horoDatage',
);
const typeBornes = ref<'dynamiqueColonne' | 'dynamiqueVariable' | 'fixe'>();

const utiliserBorne = (type: 'dynamiqueColonne' | 'dynamiqueVariable' | 'fixe') => {
  typeBornes.value = type;
  suivant();
};

const opBorne = ref<valid.typeOp>();
const valBorneFixe = ref<number>();
const valBorneDynamiqueVariable = ref<string[]>();
const valBorneDynamiqueColonne = ref<string>();

// Règle catégorique
const typeCatégorie = ref<'dynamique' | 'fixe'>();
const valCatégorieFixe = ref<(string | number | boolean)[]>();
const valCatégorieDynamique = ref<{tableau: string; colonne: string}>();

const utiliserCatégorie = (type: 'dynamique' | 'fixe') => {
  typeCatégorie.value = type;
  suivant();
};

// Confirmer
const ajouterRègle = async (règle: valid.règleVariable) => {
  émettre('sauvegarder', règle);
};
const confirmer = async () => {
  if (!cheminement.value) throw new Error('Cheminement non défini');

  if (cheminement.value === 'existe') {
    const règle: valid.règleExiste = {
      typeRègle: 'existe',
      détails: {},
    };
    await ajouterRègle(règle);
  } else if (cheminement.value === 'borne') {
    if (!opBorne.value) throw new Error('Opérateur borne non défini');
    let détails: valid.détailsRègleBornes;
    switch (typeBornes.value) {
      case 'fixe': {
        if (!valBorneFixe.value) throw new Error('Valeur borne fixe non définie');
        const détailsBorne: valid.détailsRègleBornesFixe = {
          type: 'fixe',
          op: opBorne.value,
          val: valBorneFixe.value,
        };
        détails = détailsBorne;
        break;
      }
      case 'dynamiqueColonne': {
        if (!valBorneDynamiqueColonne.value)
          throw new Error('Valeur borne dynamique colonne non définie');
        const détailsBorne: valid.détailsRègleBornesDynamiqueColonne = {
          type: 'dynamiqueColonne',
          op: opBorne.value,
          val: valBorneDynamiqueColonne.value,
        };
        détails = détailsBorne;
        break;
      }
      case 'dynamiqueVariable': {
        if (!valBorneDynamiqueVariable.value?.length)
          throw new Error('Valeur borne dynamique variable non définie');
        const détailsBorne: valid.détailsRègleBornesDynamiqueVariable = {
          type: 'dynamiqueVariable',
          op: opBorne.value,
          val: valBorneDynamiqueVariable.value[0],
        };
        détails = détailsBorne;
        break;
      }
      default:
        throw new Error(typeBornes.value);
    }
    const règle: valid.règleBornes = {
      typeRègle: 'bornes',
      détails,
    };
    await ajouterRègle(règle);
  } else {
    let détails: valid.détailsRègleValeurCatégorique;
    switch (typeCatégorie.value) {
      case 'fixe': {
        if (!valCatégorieFixe.value) throw new Error('Valeur borne fixe non définie');
        const détailsBorne: valid.détailsRègleValeurCatégoriqueFixe = {
          type: 'fixe',
          options: valCatégorieFixe.value,
        };
        détails = détailsBorne;
        break;
      }
      case 'dynamique': {
        if (!valCatégorieDynamique.value)
          throw new Error('Valeur borne dynamique colonne non définie');
        const détailsBorne: valid.détailsRègleValeurCatégoriqueDynamique = {
          type: 'dynamique',
          ...valCatégorieDynamique.value,
        };
        détails = détailsBorne;
        break;
      }
      default:
        throw new Error(typeCatégorie.value);
    }
    const règle: valid.règleValeurCatégorique = {
      typeRègle: 'valeurCatégorique',
      détails,
    };
    await ajouterRègle(règle);
  }
  dialogue.value = false;
  étape.value = 0;
};
</script>
