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
            <SelecteurBd
              :multiples="false"
              @selectionnee="ids => (idBd = ids[0])"
            />
            <SelecteurTableau
              :id-bd="idBd"
              @selectionne="x => (idTableauSélectionné = x)"
            />
          </v-window-item>
          <v-window-item :value="1">
            <v-select
              v-model="idColonne"
              :items="colonnesTableau"
            >
              <template #item="{item}">
                <ItemColonneTableau :info="item.raw" />
              </template>
              <template #selection="{item}">
                <JetonColonneTableau :info="item.raw" />
              </template>
            </v-select>
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
  </v-dialog>
</template>
<script setup lang="ts">
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';
import {suivre} from '@constl/vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '../utils';

import SelecteurTableau from '/@/components/tableaux/SélecteurTableau.vue';
import SelecteurBd from '/@/components/bds/SélecteurBd.vue';

const props = defineProps<{idTableau?: string; tableauChangeable?: boolean}>();
const émettre = defineEmits<{
  (é: 'selectionnee', info: {idColonne: string; idTableau: string}): void;
}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);
const étape = ref(props.idTableau ? 1 : 0);

const listeÉtapes = ['Tableau', 'Colonne'] as const;

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'Tableau':
      return 'tableaux.colonnes.sélecteur.titreTableau';
    case 'Colonne':
      return 'tableaux.colonnes.sélecteur.titreColonne';
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'Tableau':
      return 'tableaux.colonnes.sélecteur.sousTitreTableau';
    case 'Colonne':
      return 'tableaux.colonnes.sélecteur.sousTitreColonne';
    default:
      return '';
  }
});

const suivant = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'Colonne':
      confirmer();
      break;

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
    case 'Tableau':
      return {actif: !!idTableauSélectionné.value, visible: true};
    case 'Colonne':
      return {actif: !!idColonne.value, visible: true};
    default:
      return {actif: true, visible: true};
  }
});

const retourActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'Tableau':
      return {actif: false, visible: false};
    case 'Colonne':
      return {actif: props.tableauChangeable, visible: props.tableauChangeable};
    default:
      return {actif: true, visible: true};
  }
});

// Bd
const idBd = ref<string>();

// Tableau
const idTableauSélectionné = ref(props.idTableau);

// Colonne
const idColonne = ref<string>();
const colonnesTableau = suivre(constl.tableaux.suivreColonnesTableau, {
  idTableau: idTableauSélectionné,
});

// Contrôles
const confirmer = () => {
  if (idColonne.value && idTableauSélectionné.value)
    émettre('selectionnee', {idTableau: idTableauSélectionné.value, idColonne: idColonne.value});
};
</script>
