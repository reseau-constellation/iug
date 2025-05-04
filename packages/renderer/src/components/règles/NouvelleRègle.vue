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
        <v-card-title class="text-h5 justify-space-between d-flex align-center">
          {{ t(titreCarte) }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
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
            <v-list>
              <v-list-item
                v-if="règleExistePermise"
                color="primary"
                @click="() => suivreCheminementRègleExiste()"
              >
                {{ t('règles.types.existe') }}
                <p class="text-disabled"> {{ t('règles.indiceTypes.existe') }}</p>
              </v-list-item>
              <v-list-item
                v-if="règleBornePossible"
                @click="() => suivreCheminementRègleBorne()"
              >
                {{ t('règles.types.borne') }}
                <p class="text-disabled"> {{ t('règles.indiceTypes.borne') }}</p>
              </v-list-item>
              <v-list-item @click="() => suivreCheminementRègleCatégorique()">
                {{ t('règles.types.valeurCatégorique') }}
                <p class="text-disabled"> {{ t('règles.indiceTypes.catégorique') }}</p>
              </v-list-item>
            </v-list>
          </v-window-item>
          <v-window-item :value="1">
            <v-list>
              <v-list-item @click="() => utiliserBorne('fixe')">
                {{ t('règles.nouvelle.borneFixe') }}
              </v-list-item>
              <v-list-item @click="() => utiliserBorne('dynamiqueVariable')">
                {{ t('règles.nouvelle.borneDynamiqueVariable') }}
              </v-list-item>
              <v-list-item
                v-if="idTableauPourRègle"
                @click="() => utiliserBorne('dynamiqueColonne')"
              >
                {{ t('règles.nouvelle.borneDynamiqueColonne') }}
              </v-list-item>
            </v-list>
          </v-window-item>
          <v-window-item :value="2">
            <v-select
              v-model="opBorne"
              :items="['>', '>=', '<', '<=']"
              :label="t('règles.nouvelle.opBorne')"
              variant="outlined"
              class="mt-2"
            />
            <v-text-field
              v-if="typeBornes === 'fixe'"
              v-model="valBorneFixe"
              :label="t('règles.nouvelle.valBorneFixe')"
              variant="outlined"
            />
            <SelecteurVariable
              v-else-if="typeBornes === 'dynamiqueVariable'"
              :multiples="false"
              :interdites="source.idVariable ? [source.idVariable] : undefined"
              @selectionnee="x => (valBorneDynamiqueVariable = x)"
            />
            <SelecteurColonne
              v-else-if="typeBornes === 'dynamiqueColonne'"
              :id-tableau="idTableauPourRègle"
              :tableau-changeable="false"
              @selectionnee="x => (valBorneDynamiqueColonne = x.idColonne)"
            >
              <template #activator="{props: propsActivateur}">
                <item-colonne-tableau
                  v-if="infoColonneChoisie"
                  v-bind="propsActivateur"
                  :info="infoColonneChoisie"
                />
                <v-list-item
                  v-else
                  prepend-icon="mdi-table-column"
                  v-bind="propsActivateur"
                >
                  {{ t('règles.nouvelle.choisirColonne') }}
                </v-list-item>
              </template>
            </SelecteurColonne>
          </v-window-item>
          <v-window-item :value="3">
            <v-list>
              <v-list-item @click="() => utiliserCatégorie('fixe')">
                {{ t('règles.nouvelle.catégoriesFixes') }}
              </v-list-item>
              <v-list-item
                :disabled="!idTableauPourRègle"
                @click="() => utiliserCatégorie('dynamique')"
              >
                {{ t('règles.nouvelle.catégoriesDynamique') }}
              </v-list-item>
            </v-list>
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
            <v-divider />
            <v-list-item prepend-icon="mdi-check">{{ résuméRègle }}</v-list-item>
            <v-divider />
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

import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import BtnRetour from '/@/components/communs/BtnRetour.vue';
import BtnSuivant from '/@/components/communs/BtnSuivant.vue';
import ItemColonneTableau from '/@/components/tableaux/ItemColonneTableau.vue';
import SelecteurColonne from '/@/components/tableaux/SélecteurColonne.vue';
import SelecteurVariable from '/@/components/variables/SélecteurVariable.vue';

import {suivre} from '@constl/vue';
import {utiliserConstellation} from '../utils';
import {texteInfoRègle} from './utils';

const props = defineProps<{
  source:
    | {type: 'variable'; idVariable?: string}
    | {type: 'tableau'; idTableau?: string; idColonne?: string; idVariable?: string};
  categorieVariable?: variables.catégorieBaseVariables;
  existantes?: valid.règleVariable[];
}>();
const émettre = defineEmits<{
  (é: 'sauvegarder', règle: valid.règleVariable): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

const constl = utiliserConstellation();

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
      return {actif: !!typeBornes.value, visible: false};
    case 'CatégorieFixeOuDynamique':
      return {actif: !!typeCatégorie.value, visible: false};
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

// Règle non-manquante
const règleExistePermise = computed(() => !props.existantes?.find(r => r.typeRègle === 'existe'));

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
const colonnesTableau = suivre(constl.tableaux.suivreColonnesTableau, {
  idTableau: computed(() => (props.source.type === 'tableau' ? props.source.idTableau : undefined)),
});
const infoColonneChoisie = computed(() =>
  colonnesTableau.value?.find(c => c.id === valBorneDynamiqueColonne.value),
);

// Règle catégorique
const typeCatégorie = ref<'dynamique' | 'fixe'>();
const valCatégorieFixe = ref<(string | number | boolean)[]>();
const valCatégorieDynamique = ref<{tableau: string; colonne: string}>();

const utiliserCatégorie = (type: 'dynamique' | 'fixe') => {
  typeCatégorie.value = type;
  suivant();
};

// Confirmer
const règleFinale = computed(() => {
  if (!cheminement.value) return;

  if (cheminement.value === 'existe') {
    const règle: valid.règleExiste = {
      typeRègle: 'existe',
      détails: {},
    };
    return règle;
  } else if (cheminement.value === 'borne') {
    if (!opBorne.value) return;
    let détails: valid.détailsRègleBornes;
    switch (typeBornes.value) {
      case 'fixe': {
        if (!valBorneFixe.value) return;
        const détailsBorne: valid.détailsRègleBornesFixe = {
          type: 'fixe',
          op: opBorne.value,
          val: valBorneFixe.value,
        };
        détails = détailsBorne;
        break;
      }
      case 'dynamiqueColonne': {
        if (!valBorneDynamiqueColonne.value) return;
        const détailsBorne: valid.détailsRègleBornesDynamiqueColonne = {
          type: 'dynamiqueColonne',
          op: opBorne.value,
          val: valBorneDynamiqueColonne.value,
        };
        détails = détailsBorne;
        break;
      }
      case 'dynamiqueVariable': {
        if (!valBorneDynamiqueVariable.value?.length) return;
        const détailsBorne: valid.détailsRègleBornesDynamiqueVariable = {
          type: 'dynamiqueVariable',
          op: opBorne.value,
          val: valBorneDynamiqueVariable.value[0],
        };
        détails = détailsBorne;
        break;
      }
      default:
        return;
    }
    const règle: valid.règleBornes = {
      typeRègle: 'bornes',
      détails,
    };
    return règle;
  } else {
    let détails: valid.détailsRègleValeurCatégorique;
    switch (typeCatégorie.value) {
      case 'fixe': {
        if (!valCatégorieFixe.value) return;
        const détailsBorne: valid.détailsRègleValeurCatégoriqueFixe = {
          type: 'fixe',
          options: valCatégorieFixe.value,
        };
        détails = détailsBorne;
        break;
      }
      case 'dynamique': {
        if (!valCatégorieDynamique.value) return;
        const détailsBorne: valid.détailsRègleValeurCatégoriqueDynamique = {
          type: 'dynamique',
          ...valCatégorieDynamique.value,
        };
        détails = détailsBorne;
        break;
      }
      default:
        return;
    }
    const règle: valid.règleValeurCatégorique = {
      typeRègle: 'valeurCatégorique',
      détails,
    };
    return règle;
  }
});
const résuméRègle = computed(() => {
  if (règleFinale.value) return texteInfoRègle({règle: règleFinale.value, t});
  return undefined;
});
const ajouterRègle = async (règle: valid.règleVariable) => {
  émettre('sauvegarder', règle);
};
const confirmer = async () => {
  if (!règleFinale.value) throw new Error('Règle non définie');
  await ajouterRègle(règleFinale.value);
  dialogue.value = false;
  étape.value = 0;
};
</script>
