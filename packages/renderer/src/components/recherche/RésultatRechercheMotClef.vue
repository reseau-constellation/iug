<template>
  <v-list-item>
    <v-list-item-title>
      <TexteSurligneRecherche
        v-if="source === 'nom'"
        :info="résultat.résultatObjectif.info"
      />
      <span v-else>{{ nomTraduit || t('motsClefs.aucunNom') }}</span>
    </v-list-item-title>
    <v-list-item-subtitle>
      <TexteSurligneRecherche
        v-if="source === 'descr'"
        :info="résultat.résultatObjectif.info"
      />
      <span v-else>{{ descriptionTraduite || t('motsClefs.aucunNom') }}</span>
    </v-list-item-subtitle>
    <AuteursObjet
      :auteurs="auteurs"
      :n-max="1"
    ></AuteursObjet>
    <jeton-id-objet :id="résultat.id">
      <TexteSurligneRecherche
        v-if="source === 'id'"
        :info="résultat.résultatObjectif.info"
      />
      <span v-else>{{ résultat.id }}</span>
    </jeton-id-objet>
  </v-list-item>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import {computed} from 'vue';

import AuteursObjet from '../communs/AuteursObjet.vue';
import JetonIdObjet from '../communs/JetonIdObjet.vue';

import {constellation, suivre} from '/@/components/utils';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import TexteSurligneRecherche from './TexteSurlignéRecherche.vue';

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
const noms = suivre(constl.motsClefs.suivreNomsMotClef, {idMotClef: props.résultat.id}, {});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Descriptions
const descriptions = suivre(
  constl.motsClefs.suivreDescriptionsMotClef,
  {idMotClef: props.résultat.id},
  {},
);
const descriptionTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);

// Auteurs
const auteurs = suivre(constl.réseau.suivreAuteursMotClef, {
  idMotClef: props.résultat.id,
});
</script>
