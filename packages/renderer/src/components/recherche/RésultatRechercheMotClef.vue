<template>
  <v-list-item prepend-icon="mdi-key">
    <v-list-item-title>
      <TexteSurligneRecherche
        v-if="infoSourceNom"
        :info="infoSourceNom"
      />
      <span v-else>{{ nomTraduit || t('motsClefs.aucunNom') }}</span>
    </v-list-item-title>
    <v-list-item-subtitle v-if="infoSourceDescr || descriptionTraduite">
      <TexteSurligneRecherche
        v-if="infoSourceDescr"
        :info="infoSourceDescr"
      />
      <span v-else>{{ descriptionTraduite }}</span>
    </v-list-item-subtitle>
    <div class="mt-2">
      <AuteursObjet
        :auteurs="auteurs"
        :n-max="1"
      ></AuteursObjet>
      <jeton-id-objet
        v-if="infoSourceId"
        :id="résultat.id"
      >
        <TexteSurligneRecherche
          :info="infoSourceId"
          :max-taille="20"
        />
      </jeton-id-objet>
    </div>
    <template #append>
      <lien-objet :id="résultat.id" />
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import {suivre} from '@constl/vue';
import {type ComputedRef, computed} from 'vue';

import AuteursObjet from '../communs/AuteursObjet.vue';
import JetonIdObjet from '../communs/JetonIdObjet.vue';

import {மொழிகளைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import LienObjet from '../communs/LienObjet.vue';
import TexteSurligneRecherche from './TexteSurlignéRecherche.vue';
import {utiliserConstellation} from '/@/components/utils';

const props = defineProps<{
  résultat: types.résultatRecherche<types.infoRésultatTexte | types.infoRésultatVide>;
}>();

const constl = utiliserConstellation();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

// Sources résultat directes (nom, description, id du mot-clef)
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

// Nom
const noms = suivre(constl.motsClefs.suivreNomsMotClef, {
  idMotClef: computed(() => props.résultat.id),
});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Descriptions
const descriptions = suivre(constl.motsClefs.suivreDescriptionsMotClef, {
  idMotClef: computed(() => props.résultat.id),
});
const descriptionTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);

// Auteurs
const auteurs = suivre(constl.réseau.suivreAuteursMotClef, {
  idMotClef: computed(() => props.résultat.id),
});
</script>
