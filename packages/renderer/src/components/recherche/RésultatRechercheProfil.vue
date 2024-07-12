<template>
  <v-list-item>
    <template #prepend>
      <ImageProfil
        :id="résultat.id"
        start
      />
    </template>
    <template #title>
      <TexteSurligneRecherche
        v-if="infoSourceNom"
        :info="infoSourceNom"
      />
      <span v-else>{{ nomTraduit || t('communs.anonyme') }}</span>
    </template>
    <v-chip
      v-if="infoSourceId"
      variant="outlined"
      label
      size="small"
      prepend-icon="mdi-link"
    >
      <TexteSurligneRecherche
        :info="infoSourceId"
        :max-taille="25"
      ></TexteSurligneRecherche>
    </v-chip>
    <JetonContactMembre
      v-if="infoSourceContact && résultat.résultatObjectif.clef"
      :contact="infoSourceContact.texte"
      :type="résultat.résultatObjectif.clef"
    >
      <TexteSurligneRecherche :info="infoSourceContact"></TexteSurligneRecherche>
    </JetonContactMembre>
  </v-list-item>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import {suivre} from '@constl/vue';
import {type ComputedRef, computed} from 'vue';

import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import {utiliserConstellation} from '/@/components/utils';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import JetonContactMembre from '../membres/JetonContactMembre.vue';
import TexteSurligneRecherche from './TexteSurlignéRecherche.vue';
import ImageProfil from '/@/components/communs/ImageProfil.vue';

const props = defineProps<{
  résultat: types.résultatRecherche<types.infoRésultatTexte | types.infoRésultatVide>;
}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Source résultat
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
const infoSourceContact = sourceDirecte('contact');
const infoSourceId = sourceDirecte('id');

// Nom
const noms = suivre(constl.profil.suivreNoms, {idCompte: props.résultat.id});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);
</script>
