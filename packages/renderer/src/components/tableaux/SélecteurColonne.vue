<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="text-h5 justify-space-between align-center d-flex">
          <span>{{ t(titreCarte) }}</span>
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
              v-model="choixColonne"
              :items="colonnesTableau"
              :label="t('tableaux.colonnes.sélecteur.choixColonne')"
              variant="outlined"
              class="mt-2"
            >
              <template #item="{item, props: propsItem}">
                <ItemColonneTableau
                  v-bind="
                    Object.fromEntries(
                      Object.entries(propsItem).filter(([clef, _val]) => clef !== 'title'),
                    )
                  "
                  :info="item.raw"
                />
              </template>
              <template #selection="{item}">
                <JetonColonneTableau :info="item.raw" />
              </template>
            </v-select>
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
import {suivre} from '@constl/vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '../utils';

import type {tableaux} from '@constl/ipa';
import {watchEffect} from 'vue';
import SelecteurBd from '/@/components/bds/SélecteurBd.vue';
import BtnRetour from '/@/components/communs/BtnRetour.vue';
import BtnSuivant from '/@/components/communs/BtnSuivant.vue';
import ItemColonneTableau from '/@/components/tableaux/ItemColonneTableau.vue';
import JetonColonneTableau from '/@/components/tableaux/JetonColonneTableau.vue';
import SelecteurTableau from '/@/components/tableaux/SélecteurTableau.vue';

const props = defineProps<{idTableau?: string; tableauChangeable?: boolean}>();
const émettre = defineEmits<{
  (é: 'selectionnee', info: {idColonne: string; idTableau: string}): void;
}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);
const étape = ref(0);

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
const choixColonne = ref<tableaux.InfoCol>();
const idColonne = computed(() => choixColonne.value?.id);
const colonnesTableau = suivre(constl.tableaux.suivreColonnesTableau, {
  idTableau: idTableauSélectionné,
});

watchEffect(() => {
  if (idColonne.value && !colonnesTableau.value?.find(c => c.id === idColonne.value)) {
    choixColonne.value = undefined;
  }
});

// Contrôles
const confirmer = () => {
  if (idColonne.value && idTableauSélectionné.value)
    émettre('selectionnee', {idTableau: idTableauSélectionné.value, idColonne: idColonne.value});
  fermer();
};
const fermer = () => {
  dialogue.value = false;
  idBd.value = undefined;
  étape.value = 0;
};
</script>
