<template>
  <v-dialog
    v-model="dialogue"
    :max-width="mdAndUp ? 500 : 300"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card>
      <v-card-item>
        <v-card-title class="d-flex align-center">
          {{ t('épingler.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="fermer"
          >
          </v-btn>
        </v-card-title>
      </v-card-item>
      <v-divider />
      <v-card-text style="overflow-y: scroll">
        <v-icon start>mdi-pin-outline</v-icon>
        <span class="font-weight-bold">{{ t('épingler.dispositifsÉpingle') }}</span>
        <selection-dispositifs
          v-model:selection="sélectionBase"
          v-model:specifiques="spécifiquesBase"
          class="ms-4"
        />

        <v-expand-transition>
          <div v-show="sélectionBase !== 'AUCUN'">
            <p class="mb-2">
              <span>{{ t('épingler.optionsAvancées') }}</span>
              <v-btn
                :icon="optionsAvancées ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                size="xsmall"
                variant="flat"
                @click="() => (optionsAvancées = !optionsAvancées)"
              ></v-btn>
            </p>

            <v-expand-transition>
              <div v-show="optionsAvancées">
                <v-divider class="mb-2" />
                <p>
                  <v-icon start>mdi-database</v-icon>
                  <span class="font-weight-bold">{{ t('épingler.dispositifsÉpingleBds') }}</span>
                </p>
                <selection-dispositifs
                  v-model:selection="sélectionBds"
                  v-model:specifiques="spécifiquesBds"
                  class="ms-4"
                />
                <p>
                  <v-icon start>mdi-table-multiple</v-icon>
                  <span class="font-weight-bold">{{
                    t('épingler.dispositifsÉpingleDonnées')
                  }}</span>
                </p>
                <selection-dispositifs
                  v-model:selection="sélectionTableaux"
                  v-model:specifiques="spécifiquesTableaux"
                  class="ms-4"
                />
                <p>
                  <v-icon start>mdi-image-multiple-outline</v-icon>
                  <span class="font-weight-bold">{{
                    t('épingler.dispositifsÉpingleDocuments')
                  }}</span>
                </p>
                <selection-dispositifs
                  v-model:selection="sélectionFichiersTableaux"
                  v-model:specifiques="spécifiquesFichiersTableaux"
                  class="ms-4"
                />
              </div>
            </v-expand-transition>
          </div>
        </v-expand-transition>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer></v-spacer>
        <btn-annuler @click="fermer" />
        <btn-sauvegarder
          :actif="prêtÀÉpingler && valeursChangées"
          :en-attente="enProgrès"
          @click="() => épingler()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {type favoris} from '@constl/ipa';

import {suivre} from '@constl/vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import SelectionDispositifs from './SélectionDispositifs.vue';
import {optionsDispositifs} from './utils';
import {utiliserConstellation} from '/@/components/utils';

import BtnAnnuler from '/@/components/communs/BtnAnnuler.vue';
import BtnSauvegarder from '/@/components/communs/BtnSauvegarder.vue';

const props = defineProps<{idProjet: string}>();

const constl = utiliserConstellation();

const {mdAndUp} = useDisplay();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

// Navigation
const dialogue = ref(false);
const optionsAvancées = ref(false);

// Épingle actuelle
const épingle = suivre(constl.projets.suivreÉpingleProjet, {
  idProjet: computed(() => props.idProjet),
});

// Options
const {
  sélection: sélectionBase,
  dispositifs: dispositifsBase,
  spécifiques: spécifiquesBase,
  valide: baseValide,
  modifié: baseModifié,
} = optionsDispositifs(
  computed(() => épingle.value?.base),
  'TOUS',
);
const {
  sélection: sélectionBds,
  dispositifs: dispositifsBds,
  spécifiques: spécifiquesBds,
  valide: bdsValide,
  modifié: bdsModifié,
} = optionsDispositifs(
  computed(() => épingle.value?.bds.base),
  'TOUS',
);
const {
  sélection: sélectionTableaux,
  dispositifs: dispositifsTableaux,
  spécifiques: spécifiquesTableaux,
  valide: tableauxValide,
  modifié: tableauxModifié,
} = optionsDispositifs(
  computed(() => épingle.value?.bds.données.tableaux),
  'INSTALLÉ',
);
const {
  sélection: sélectionFichiersTableaux,
  dispositifs: dispositifsFichiersTableaux,
  spécifiques: spécifiquesFichiersTableaux,
  valide: fichiersTableauxValide,
  modifié: fichiersTableauxModifié,
} = optionsDispositifs(
  computed(() => épingle.value?.bds.données.fichiers),
  'INSTALLÉ',
);

// Sauvegarder
const prêtÀÉpingler = computed(() => {
  return baseValide && bdsValide && tableauxValide && fichiersTableauxValide;
});

const valeursChangées = computed(() => {
  return (
    baseModifié.value || bdsModifié.value || tableauxModifié.value || fichiersTableauxModifié.value
  );
});

const enProgrès = ref(false);
const épingler = async () => {
  enProgrès.value = true;

  if (dispositifsBase.value !== 'AUCUN') {
    const épingle: favoris.ÉpingleProjet = {
      type: 'projet',
      base: dispositifsBase.value,
      bds: {
        type: 'bd',
        base: dispositifsBds.value,
        données: {
          tableaux: dispositifsTableaux.value,
          fichiers: dispositifsFichiersTableaux.value,
        },
      },
    };
    await constl.projets.épinglerProjet({
      idProjet: props.idProjet,
      options: épingle,
    });
  } else {
    await désépingler();
  }
  fermer();
};
const désépingler = async () => {
  await constl.favoris.désépinglerFavori({idObjet: props.idProjet});
};

// Fermer
const fermer = () => {
  dialogue.value = false;
  enProgrès.value = false;
};
</script>
