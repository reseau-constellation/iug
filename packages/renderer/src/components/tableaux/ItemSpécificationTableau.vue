<template>
  <v-list-group :value="clef">
    <template #activator="{props: propsActivateur}">
      <v-list-item
        v-bind="propsActivateur"
        prepend-icon="mdi-table"
      >
        <v-list-item-title>
          <DialogueNoms
            :etiquette-nom="t('listeNomsProfil.étiquetteNom')"
            :indice-nom="t('listeNomsProfil.indiceNom')"
            :indice-langue="t('listeNomsProfil.indiceLangue')"
            :texte-aucun-nom="t('listeNomsProfil.texteAucunNom')"
            :titre="t('tableaux.spécification.titreDialogueNoms')"
            :sous-titre="t('tableaux.spécification.sousTitreDialogueNoms')"
            :noms-initiaux="noms"
            :autorisation-modification="modificationPermise"
            @ajuster-noms="modifierNoms"
          >
            <template #activator="{props: propsActivateurDialogueNoms}">
              <span v-bind="propsActivateurDialogueNoms">
                {{ nomTraduit || t('communs.baseCarteObjet.sansNom') }}
                <v-btn
                  :icon="modificationPermise ? 'mdi-pencil' : 'mdi-earth'"
                  variant="flat"
                  size="small"
                ></v-btn>
              </span>
            </template>
          </DialogueNoms>
        </v-list-item-title>
      </v-list-item>
    </template>
    <NouvelleColonne
      :variables-interdites="variablesDéjàAjoutées"
      @nouvelle="ajouterColonne"
    >
      <template #activator="{props: propsActivateur}">
        <v-list-item v-bind="propsActivateur">
          <template #prepend>
            <v-icon> mdi-plus </v-icon>
          </template>
          <template #title>
            {{ t('tableaux.spécification.nouvelleColonne') }}
          </template>
        </v-list-item>
      </template>
    </NouvelleColonne>

    <ItemSpecificationColonne
      v-for="col in colonnes"
      :id="col.info.id"
      :key="col.info.id"
      :id-variable="col.info.variable"
      :index="col.info.index"
      :règles="col.règles"
      :modification-permise="modificationPermise"
      @modifier-colonne="info => modifierColonne(col.info.id, info)"
      @effacer-colonne="() => effacerColonne(col.info.id)"
    />
  </v-list-group>
</template>

<script setup lang="ts">
import type {tableaux, valid} from '@constl/ipa';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import ItemSpecificationColonne from './ItemSpécificationColonne.vue';
import NouvelleColonne from './NouvelleColonne.vue';
import DialogueNoms from '/@/components/communs/listeNoms/DialogueNoms.vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const props = defineProps<{
  clef: string;
  noms: {[langue: string]: string};
  idTableau?: string;
  colonnes: {info: tableaux.InfoColAvecCatégorie; règles: valid.règleVariable[]}[];
  modificationPermise: boolean;
}>();
const émettre = defineEmits<{
  (é: 'modifier-noms', noms: {[langue: string]: string}): void;
  (
    é: 'nouvelle-colonne',
    info: {idVariable: string; index?: boolean; règles: valid.règleVariable[]},
  ): void;
  (é: 'modifier-colonne', info: {idColonne: string; idVariable: string; index?: boolean}): void;
  (é: 'effacer-colonne', idColonne: string): void;
}>();

// Noms
const modifierNoms = (noms_: {[langue: string]: string}) => {
  émettre('modifier-noms', noms_);
};
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(computed(() => props.noms));

// Variables déjà ajoutées au tableau, qu'on ne veut pas associer à de nouvelles colonnes
const variablesDéjàAjoutées = computed(() => {
  return props.colonnes.map(c => c.info.variable);
});

// Modification colonnes
const modifierColonne = (idColonne: string, info: {idVariable: string; index?: boolean}) => {
  émettre('modifier-colonne', {idColonne, ...info});
};
const effacerColonne = (idColonne: string) => {
  émettre('effacer-colonne', idColonne);
};
const ajouterColonne = (info: {
  idVariable: string;
  index?: boolean;
  règles: valid.règleVariable[];
}) => {
  émettre('nouvelle-colonne', info);
};
</script>
