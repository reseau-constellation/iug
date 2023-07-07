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
import {enregistrerÉcoute} from '/@/components/utils';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {utiliserMonAutorisationRègleSourceErreur} from './utils';
import NouvelleColonne from '../../tableaux/NouvelleColonne.vue';

const props = defineProps<{idTableau: string; erreur: valid.erreurRègleBornesColonneInexistante}>();

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

// Id colonne référence
const idColonneRéf = computed(() => props.erreur.règle.règle.règle.détails.val);

// Autorisation
const monAutorisation = utiliserMonAutorisationRègleSourceErreur({
  erreur: props.erreur,
  idTableau: props.idTableau,
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
