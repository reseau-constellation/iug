<template>
  <v-list-item :prepend-icon="icône">
    <v-list-item-title>
      <TexteSurligneRecherche
        v-if="infoSourceNom"
        :info="infoSourceNom"
      />
      <v-skeleton-loader
        v-else-if="!noms"
        type="text"
      />
      <span v-else>{{ nomTraduit || t('variables.aucunNom') }}</span>
    </v-list-item-title>
    <v-list-item-subtitle v-if="infoSourceDescr || descriptionTraduite">
      <TexteSurligneRecherche
        v-if="infoSourceDescr"
        :info="infoSourceDescr"
      />
      <span v-else>{{ descriptionTraduite || t('variables.aucuneDescription') }}</span>
    </v-list-item-subtitle>
    <AuteursObjet
      :auteurs="auteurs"
      :n-max="1"
    ></AuteursObjet>
    <jeton-id-objet :id="résultat.id">
      <TexteSurligneRecherche
        v-if="infoSourceId"
        :info="infoSourceId"
      />
      <TexteTronque
        v-else
        :texte="résultat.id.slice(9)"
        :longueur-max="13"
      />
    </jeton-id-objet>
  </v-list-item>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import {type ComputedRef, computed} from 'vue';

import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import AuteursObjet from '/@/components/communs/AuteursObjet.vue';
import JetonIdObjet from '/@/components/communs/JetonIdObjet.vue';

import {constellation, suivre} from '/@/components/utils';
import {icôneCatégorieVariable} from '/@/components/variables/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import TexteSurligneRecherche from './TexteSurlignéRecherche.vue';
import TexteTronque from '../communs/TexteTronqué.vue';

const props = defineProps<{
  résultat: types.résultatRecherche<types.infoRésultatTexte | types.infoRésultatVide>;
}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Sources résultat directes (nom, description, id de la variable)
const sourceDirecte = (de: string): ComputedRef<types.infoRésultatTexte | undefined> => {
  return computed(() => {
    const {de: sourceRésultat, info} = props.résultat.résultatObjectif;
    if (info.type === 'texte' && sourceRésultat === de) {
      return info;
    } else {
      return undefined;
    }
  });
};

const infoSourceNom = sourceDirecte('nom');
const infoSourceDescr = sourceDirecte('descr');
const infoSourceId = sourceDirecte('id');

// Icône
const icône = computed(() =>
  catégorie.value ? icôneCatégorieVariable(catégorie.value) : 'mdi-variable',
);
const catégorie = suivre(constl.variables.suivreCatégorieVariable, {idVariable: props.résultat.id});

// Nom
const noms = suivre(constl.variables.suivreNomsVariable, {idVariable: props.résultat.id});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Descriptions
const descriptions = suivre(constl.variables.suivreDescriptionsVariable, {
  idVariable: props.résultat.id,
});
const descriptionTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);

// Auteurs
const auteurs = suivre(constl.réseau.suivreAuteursVariable, {idVariable: props.résultat.id});
</script>
