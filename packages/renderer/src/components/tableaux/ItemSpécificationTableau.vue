<template>
  <v-list-group :value="clef">
    <template #activator="{props: propsActivateur}">
      <v-list-item
        v-bind="propsActivateur"
        prepend-icon="mdi-account-circle"
      >
        <v-list-item-title>
          <DialogueNoms
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
      :id="col.id"
      :key="col.id"
      :id-variable="col.variable"
      :index="col.index"
      :modification-permise="modificationPermise"
      @modifier-colonne="info => modifierColonne(col.id, info)"
      @effacer-colonne="() => effacerColonne(col.id)"
    />
  </v-list-group>
</template>

<script setup lang="ts">
import type {tableaux, valid} from '@constl/ipa';

import ItemSpecificationColonne from './ItemSpécificationColonne.vue';
import NouvelleColonne from './NouvelleColonne.vue';
import DialogueNoms from '/@/components/communs/listeNoms/DialogueNoms.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {computed} from 'vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {traduireNom} = utiliserLangues();

const props = defineProps<{
  clef: string;
  noms: {[langue: string]: string};
  idTableau?: string;
  colonnes: tableaux.InfoColAvecCatégorie[];
  modificationPermise: boolean;
}>();
const émettre = defineEmits<{
  (é: 'modifier-noms', noms: {[langue: string]: string}): void;
  (
    é: 'nouvelle-colonne',
    info: {idVariable: string; index?: boolean; règles: valid.règleVariableAvecId[]},
  ): void;
  (é: 'modifier-colonne', info: {idColonne: string; idVariable: string; index?: boolean}): void;
  (é: 'effacer-colonne', idColonne: string): void;
}>();

// Noms
const modifierNoms = (noms_: {[langue: string]: string}) => {
  émettre('modifier-noms', noms_);
};
const nomTraduit = traduireNom(computed(() => props.noms));

// Variables déjà ajoutées au tableau, qu'on ne veut pas associer à de nouvelles colonnes
const variablesDéjàAjoutées = computed(() => {
  return props.colonnes.map(c => c.variable);
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
  règles: valid.règleVariableAvecId[];
}) => {
  émettre('nouvelle-colonne', info);
};
</script>
