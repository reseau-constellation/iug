<template>
  <v-list-item>
    <v-list-item-title>
      {{ t('règles.erreursRègle.colonneCatégInexistante.titre') }}
    </v-list-item-title>
    <v-list-item-subtitle>
      {{
        t('règles.erreursRègle.colonneCatégInexistante.info', {
          tableau: nomTableau,
          colonne: idColonne,
        })
      }}
      <SélecteurColonne
        v-if="monAutorisation"
        :id-tableau="idTableauRéf"
        tableau-changeable
        @selectionnee="changerColonne"
      >
        <v-btn>{{ t('règles.erreursRègle.colonneCatégInexistante.réparer') }}</v-btn>
      </SélecteurColonne>
      <span v-else>
        {{ t('règles.erreursRègles.permissionsInsuffisantes') }}
      </span>
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
import type {ClientConstellation} from '@constl/ipa';

import type {valid} from '@constl/ipa';

import {computed, inject, ref} from 'vue';
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import {enregistrerÉcoute} from '/@/components/utils';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserMonAutorisationRègleSourceErreur} from './utils';

const props = defineProps<{
  idTableau: string;
  erreur: valid.erreurRègleCatégoriqueColonneInexistante;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const constl = inject<ClientConstellation>('constl');

// Nom tableau référence catégorie
const idTableauRéf = computed(() => props.erreur.règle.règle.règle.détails.tableau);

const nomsTableau = ref<{[langue: string]: string}>({});
const nomTableau = அகராதியிலிருந்து_மொழிபெயர்ப்பு(nomsTableau);
enregistrerÉcoute(
  constl?.tableaux.suivreNomsTableau({
    idTableau: idTableauRéf.value,
    f: x => (nomsTableau.value = x),
  }),
);

// Id colonne référence catégorie
const idColonne = computed(() => props.erreur.règle.règle.règle.détails.colonne);

// Autorisation
const monAutorisation = utiliserMonAutorisationRègleSourceErreur({
  erreur: props.erreur,
  idTableau: props.idTableau,
});

// Actions
const changerColonne = async ({
  idTableauNouveau,
  idColNouvelle,
}: {
  idTableauNouveau: string;
  idColNouvelle: string;
}) => {
  const {source} = props.erreur.règle;
  const nouvelleRègle: valid.règleValeurCatégorique<valid.détailsRègleValeurCatégoriqueDynamique> =
    {
      typeRègle: 'valeurCatégorique',
      détails: {
        type: 'dynamique',
        tableau: idTableauNouveau,
        colonne: idColNouvelle,
      },
    };
  await effacerRègle();
  if (source.type === 'tableau') {
    await constl?.tableaux.ajouterRègleTableau({
      idTableau: props.idTableau,
      idColonne: props.erreur.règle.colonne,
      règle: nouvelleRègle,
    });
  } else {
    const idVariableSource = props.erreur.règle.source.id;
    await constl?.variables.ajouterRègleVariable({
      idVariable: idVariableSource,
      règle: nouvelleRègle,
    });
  }
};

const effacerRègle = async () => {
  const {source} = props.erreur.règle;
  if (!monAutorisation.value) return;

  if (source.type === 'tableau') {
    await constl?.tableaux.effacerRègleTableau({
      idTableau: props.idTableau,
      idRègle: props.erreur.règle.règle.id,
    });
  } else {
    const idVariableSource = props.erreur.règle.source.id;
    await constl?.variables.effacerRègleVariable({
      idVariable: idVariableSource,
      idRègle: props.erreur.règle.règle.id,
    });
  }
};
</script>
