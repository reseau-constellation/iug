<template>
  <v-list-item>
    <v-list-item-title>
      {{ t('règles.erreursRègle.variableBornesInexistante.titre') }}
    </v-list-item-title>
    <v-list-item-subtitle>
      {{
        t('règles.erreursRègle.variableBornesInexistante.info', {
          tableau: nomTableau,
          variable: nomVariable,
        })
      }}
      <SélecteurVariable
        v-if="monAutorisation"
        :id-tableau="idTableau"
        @selectionnee="changerVariable"
      >
        <v-btn>{{ t('règles.erreursRègles.variableBornesInexistante.changerVariable') }}</v-btn>
      </SélecteurVariable>
      <span v-else>
        {{ t('règles.erreursRègles.permissionsInsuffisantes') }}
      </span>
      <nouvelle-colonne
        :id-tableau="idTableau"
        :id-variable="idVariable"
      >
        <template #activator="{props: propsActivateur}">
          <v-btn v-bind="propsActivateur">
            {{ t('règles.erreursRègles.variableBonesInexistante.ajouterColonne') }}
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
import type {client} from '@constl/ipa';
import type {valid} from '@constl/ipa';

import {computed, inject, ref} from 'vue';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {enregistrerÉcoute} from '/@/components/utils';

import NouvelleColonne from '/@/components/tableaux/NouvelleColonne.vue';

import {utiliserMonAutorisationRègleSourceErreur} from './utils';

const props = defineProps<{
  idTableau: string;
  erreur: valid.erreurRègleBornesVariableNonPrésente;
}>();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {traduireNom} = utiliserLangues();

const constl = inject<client.ClientConstellation>('constl');

// Nom de ce tableau
const nomsTableau = ref<{[langue: string]: string}>({});
const nomTableau = traduireNom(nomsTableau);
enregistrerÉcoute(
  constl?.tableaux?.suivreNomsTableau({
    idTableau: props.idTableau,
    f: x => (nomsTableau.value = x),
  }),
);

// Nom variable référence
const idVariable = computed(() => props.erreur.règle.règle.règle.détails.val);
const nomsVariable = ref<{[langue: string]: string}>({});
const nomVariable = traduireNom(nomsVariable);
enregistrerÉcoute(
  constl?.variables?.suivreNomsVariable({
    id: idVariable.value,
    f: x => (nomsTableau.value = x),
  }),
);

// Autorisation
const monAutorisation = utiliserMonAutorisationRègleSourceErreur({
  erreur: props.erreur,
  idTableau: props.idTableau,
});

// Actions
const changerVariable = async (idVar: string) => {
  const {source} = props.erreur.règle;
  const {op} = props.erreur.règle.règle.règle.détails;
  const nouvelleRègle: valid.règleBornes<valid.détailsRègleBornesDynamiqueVariable> = {
    typeRègle: 'bornes',
    détails: {
      type: 'dynamiqueVariable',
      val: idVar,
      op,
    },
  };
  await effacerRègle();
  if (source.type === 'tableau') {
    await constl?.tableaux?.ajouterRègleTableau({
      idTableau: props.idTableau,
      idColonne: props.erreur.règle.colonne,
      règle: nouvelleRègle,
    });
  } else {
    const idVariableSource = props.erreur.règle.source.id;
    await constl?.variables?.ajouterRègleVariable({
      idVariable: idVariableSource,
      règle: nouvelleRègle,
    });
  }
};

const effacerRègle = async () => {
  const {source} = props.erreur.règle;
  if (!monAutorisation.value) return;

  if (source.type === 'tableau') {
    await constl?.tableaux?.effacerRègleTableau({
      idTableau: props.idTableau,
      idRègle: props.erreur.règle.règle.id,
    });
  } else {
    const idVariableSource = props.erreur.règle.source.id;
    await constl?.variables?.effacerRègleVariable({
      idVariable: idVariableSource,
      idRègle: props.erreur.règle.règle.id,
    });
  }
};
</script>
