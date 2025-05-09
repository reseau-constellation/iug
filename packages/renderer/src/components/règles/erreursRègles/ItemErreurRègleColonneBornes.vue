<template>
  <v-list-item>
    <v-list-item-title>
      {{ t('règles.erreursRègle.colonneBornesInexistante.titre') }}
    </v-list-item-title>
    <v-list-item-subtitle>
      {{
        t('règles.erreursRègle.colonneBornesInexistante.info', {
          tableau: nomTableau,
          colonne: idColonneRéf,
        })
      }}
      <SélecteurColonne
        v-if="monAutorisation"
        :id-tableau="idTableau"
        :tableau-changeable="false"
        @selectionnee="changerColonne"
      >
        <v-btn>{{ t('règles.erreursRègle.colonneBornesInexistante.réparer') }}</v-btn>
      </SélecteurColonne>
      <span v-else>
        {{ t('règles.erreursRègles.permissionsInsuffisantes') }}
      </span>
      <nouvelle-colonne
        :id-tableau="idTableau"
        :id-colonne="idColonneRéf"
        @nouvelle="info => créerColonneTableau({idTableau, ...info})"
      >
        <template #activateur="{props: propsActivateur}">
          <v-btn v-bind="propsActivateur">
            {{ t('règles.erreursRègles.variableBornesInexistante.ajouterColonne') }}
          </v-btn>
        </template>
      </nouvelle-colonne>
    </v-list-item-subtitle>
    <v-list-item-action v-if="monAutorisation">
      <v-btn
        color="error"
        icon="mdi-delete"
        @click="() => effacerRègle()"
      />
    </v-list-item-action>
  </v-list-item>
</template>
<script setup lang="ts">
import type {valid} from '@constl/ipa';

import {suivre} from '@constl/vue';
import {computed} from 'vue';

import {மொழிகளைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import NouvelleColonne from '/@/components/tableaux/NouvelleColonne.vue';
import {utiliserConstellation} from '/@/components/utils';

import {utiliserMonAutorisationRègleSourceErreur} from './utils';
import {créerColonneTableau} from '/@/components/tableaux/utils';

const props = defineProps<{idTableau: string; erreur: valid.erreurRègleBornesColonneInexistante}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const constl = utiliserConstellation();

// Nom de ce tableau
const nomsTableau = suivre(constl.tableaux.suivreNomsTableau, {
  idTableau: computed(() => props.idTableau),
});
const nomTableau = அகராதியிலிருந்து_மொழிபெயர்ப்பு(nomsTableau);

// Id colonne référence
const idColonneRéf = computed(() => props.erreur.règle.règle.règle.détails.val);

// Autorisation
const monAutorisation = utiliserMonAutorisationRègleSourceErreur({
  erreur: computed(() => props.erreur),
  idTableau: computed(() => props.idTableau),
});

// Actions
const changerColonne = async (idCol: string) => {
  const {source} = props.erreur.règle;
  const {op} = props.erreur.règle.règle.règle.détails;
  const nouvelleRègle: valid.règleBornes<valid.détailsRègleBornesDynamiqueColonne> = {
    typeRègle: 'bornes',
    détails: {
      type: 'dynamiqueColonne',
      val: idCol,
      op,
    },
  };
  await effacerRègle();
  if (source.type === 'tableau') {
    await constl.tableaux.ajouterRègleTableau({
      idTableau: props.idTableau,
      idColonne: props.erreur.règle.colonne,
      règle: nouvelleRègle,
    });
  } else {
    const idVariableSource = props.erreur.règle.source.id;
    await constl.variables.ajouterRègleVariable({
      idVariable: idVariableSource,
      règle: nouvelleRègle,
    });
  }
};

const effacerRègle = async () => {
  const {source} = props.erreur.règle;
  if (!monAutorisation.value) return;

  if (source.type === 'tableau') {
    await constl.tableaux.effacerRègleTableau({
      idTableau: props.idTableau,
      idRègle: props.erreur.règle.règle.id,
    });
  } else {
    const idVariableSource = props.erreur.règle.source.id;
    await constl.variables.effacerRègleVariable({
      idVariable: idVariableSource,
      idRègle: props.erreur.règle.règle.id,
    });
  }
};
</script>
