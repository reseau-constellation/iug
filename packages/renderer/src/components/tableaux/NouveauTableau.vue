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
      :width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex">
          {{ t(titreCarte) }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="() => (dialogue = false)"
          ></v-btn>
        </v-card-title>
        <v-card-subtitle> {{ t(sousTitreCarte) }} </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <v-window
          v-model="étape"
          style="overflow-y: scroll"
        >
          <v-window-item :value="0">
            <liste-noms
              :texte-aucun-nom="t('communs.texteAucunNom')"
              :indice-langue="t('communs.indiceLangue')"
              :etiquette-nom="t('communs.étiquetteNom')"
              :indice-nom="t('tableaux.nouveau.texteIndiceNom')"
              :noms-initiaux="noms"
              :autorisation-modification="true"
              @ajuster-noms="ajusterNoms"
            />
          </v-window-item>
          <v-window-item :value="1">
            <v-list>
              <nouvelle-colonne
                :variables-interdites="variablesDéjàAjoutées"
                @nouvelle="col => ajouterColonne(col)"
              >
                <template #activator="{props: propsActivateur}">
                  <v-list-item
                    v-bind="propsActivateur"
                    :title="t('tableaux.nouveau.ajouterColonne')"
                    prepend-icon="mdi-table-column-plus-after"
                  ></v-list-item>
                </template>
              </nouvelle-colonne>
              <ItemSpecificationColonne
                v-for="col in colonnes"
                :id="col.info.id"
                :key="col.info.id"
                :id-variable="col.info.variable"
                :index="col.info.index"
                :règles="col.règles"
                modification-permise
                @modifier-colonne="modifierColonne"
                @effacer-colonne="() => effacerColonne(col.info.id)"
              />
            </v-list>
          </v-window-item>
          <v-window-item :value="2">
            <div class="text-center">
              <v-btn
                class="mt-3"
                variant="outlined"
                @click="confirmer"
              >
                {{ t('tableaux.nouveau.texteBtnCréation') }}
              </v-btn>
            </div>
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
import type {tableaux as tblx, valid} from '@constl/ipa';

import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {v4 as uuidv4} from 'uuid';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import ListeNoms from '/@/components/communs/listeNoms/ListeNoms.vue';
import ItemSpecificationColonne from '/@/components/tableaux/ItemSpécificationColonne.vue';
import NouvelleColonne from './NouvelleColonne.vue';

const émettre = defineEmits<{
  (
    é: 'sauvegarder',
    args: {
      noms: {[langue: string]: string};
      cols: {info: tblx.InfoCol; règles: valid.règleVariable[]}[];
    },
  ): void;
}>();

const {mdAndUp} = useDisplay();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = ['noms', 'colonnnes', 'confirmation'] as const;

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return 'tableaux.nouveau.titreNoms';
    case 'colonnnes':
      return 'tableaux.nouveau.titreColonnes';
    case 'confirmation':
      return 'tableaux.nouveau.titreConfirmation';
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return 'tableaux.nouveau.sousTitreNoms';
    case 'colonnnes':
      return 'tableaux.nouveau.sousTitreColonnes';
    case 'confirmation':
      return 'tableaux.nouveau.sousTitreConfirmation';
    default:
      return '';
  }
});

const retour = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      étape.value--;
      break;
  }
};

const suivant = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      étape.value++;
      break;
  }
};

const suivantActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
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
    case 'noms':
      return {actif: false, visible: false};
    default:
      return {actif: true, visible: true};
  }
});

// Noms tableau
const noms = ref<{[langue: string]: string}>({});
const ajusterNoms = (nms: {[lng: string]: string}) => {
  noms.value = nms;
};

// Colonnes
const colonnes = ref<{info: tblx.InfoCol; règles: valid.règleVariable[]}[]>([]);
const ajouterColonne = ({
  idVariable,
  idColonne,
  index,
  règles,
}: {
  idVariable: string;
  idColonne?: string | undefined;
  index: boolean;
  règles: valid.règleVariable[];
}) => {
  colonnes.value = [
    ...colonnes.value,
    {
      info: {
        id: idColonne || uuidv4(),
        variable: idVariable,
        index,
      },
      règles,
    },
  ];
};
const modifierColonne = () => {};
const effacerColonne = (idColonne: string) => {
  colonnes.value = colonnes.value.filter(c => c.info.id !== idColonne);
};

const variablesDéjàAjoutées = computed(() => {
  return colonnes.value.map(c => c.info.variable);
});

// Confirmation
const confirmer = () => {
  émettre('sauvegarder', {
    noms: noms.value,
    cols: colonnes.value || [],
  });
  fermer();
};

const fermer = () => {
  noms.value = {};
  colonnes.value = [];

  étape.value = 0;
  dialogue.value = false;
};
</script>
