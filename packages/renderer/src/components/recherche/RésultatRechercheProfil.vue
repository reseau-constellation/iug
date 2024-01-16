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
        v-if="source === 'nom'"
        :info="résultat.résultatObjectif.info"
      />
      <span v-else>{{ nomTraduit || t('communs.anonyme') }}</span>
    </template>
    <v-chip
      v-if="source === 'id'"
      variant="outlined"
      label
      size="small"
      prepend-icon="mdi-link"
    >
      <TexteSurligneRecherche
        :info="résultat.résultatObjectif.info"
        :max-taille="25"
      ></TexteSurligneRecherche>
    </v-chip>
    <JetonContactMembre
      v-if="source === 'contact' && résultat.résultatObjectif.clef"
      :contact="résultat.résultatObjectif.info.texte"
      :type="résultat.résultatObjectif.clef"
    >
      <TexteSurligneRecherche :info="résultat.résultatObjectif.info"></TexteSurligneRecherche>
    </JetonContactMembre>
  </v-list-item>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import {computed} from 'vue';

import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import {constellation, suivre} from '/@/components/utils';

import ImageProfil from '/@/components/communs/ImageProfil.vue';
import JetonContactMembre from '../membres/JetonContactMembre.vue';
import TexteSurligneRecherche from './TexteSurlignéRecherche.vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{résultat: types.résultatRecherche<types.infoRésultatTexte>}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

// Source résultat
const source = computed(() => {
  return props.résultat.résultatObjectif.de;
});

// Nom
const noms = suivre(constl.profil.suivreNoms, {idCompte: props.résultat.id}, {});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);
</script>
