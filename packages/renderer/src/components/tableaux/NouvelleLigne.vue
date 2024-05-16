<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      />
    </template>
    <v-card>
      <v-card-item>
        <v-card-title> </v-card-title>
      </v-card-item>
      <v-card-text>
        <div
          v-for="col in colonnes"
          :key="col.id"
        >
          <entree-donnee
            :categorie="col.catégorie"
            @sauvegarder="val => spécifierVal({col: col.id, val})"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="!prêtÀSauvegarder"
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
import type {tableaux, valid} from '@constl/ipa';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref} from 'vue';

import EntreeDonnee from '/@/components/tableaux/EntréeDonnée.vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const props = defineProps<{
  colonnes: tableaux.InfoColAvecCatégorie[];
  regles?: valid.règleColonne[];
}>();

const émettre = defineEmits<{
  (é: 'sauvegarder', vals: {[idCol: string]: tableaux.élémentBdListeDonnées}): void;
}>();

// Navigation
const dialogue = ref(false);

// Colonnes
const colonnesObligatoires = computed(() => {
  const idsColonnes = props.colonnes.map(col => col.id);
  return props.regles
    ?.filter(r => idsColonnes.includes(r.colonne) && r.règle.règle.typeRègle === 'existe')
    .map(r => r.colonne);
});

// Données
const vals = ref<{[idCol: string]: tableaux.élémentBdListeDonnées}>({});
const spécifierVal = ({col, val}: {col: string; val?: tableaux.élémentBdListeDonnées}) => {
  const valsSansLaColonne = Object.fromEntries(
    Object.entries(vals.value).filter(([c, _v]) => c !== col),
  );
  if (val === undefined) {
    vals.value = valsSansLaColonne;
  } else {
    vals.value = Object.fromEntries([...Object.entries(valsSansLaColonne), [col, val]]);
  }
};

// Sauvegarder
const prêtÀSauvegarder = computed(() => {
  const aucuneManquante = colonnesObligatoires.value?.every(c =>
    Object.keys(vals.value).includes(c),
  );
  return aucuneManquante;
});
const sauvegarder = () => {
  émettre('sauvegarder', vals.value);
};
const fermer = () => {
  dialogue.value = false;
  vals.value = {};
};
</script>
