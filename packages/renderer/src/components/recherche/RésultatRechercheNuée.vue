<template>
  <v-list-item>
    <v-list-item-title>
      <TexteSurligneRecherche
        v-if="infoSourceNom"
        :info="infoSourceNom"
      />
      <span v-else>{{ nomTraduit || t('nuées.aucunNom') }}</span>
    </v-list-item-title>
    <v-list-item-subtitle>
      <TexteSurligneRecherche
        v-if="infoSourceDescr"
        :info="infoSourceDescr"
      />
      <span v-else>{{ descriptionTraduite || t('nuées.aucuneDescription') }}</span>
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
      <span v-else>{{ résultat.id }}</span>
    </jeton-id-objet>
    <JetonVariable
      v-if="infoSourceVariable"
      :id="infoSourceVariable.id"
    >
      <TexteSurligneRecherche :info="infoSourceVariable.info.info" />
    </JetonVariable>
    <JetonMotClef
      v-if="infoSourceMotClef"
      :id="infoSourceMotClef.id"
    >
      <TexteSurligneRecherche :info="infoSourceMotClef.info.info" />
    </JetonMotClef>
  </v-list-item>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import {computed} from 'vue';
import type {ComputedRef} from 'vue';

import AuteursObjet from '/@/components/communs/AuteursObjet.vue';
import JetonIdObjet from '/@/components/communs/JetonIdObjet.vue';
import JetonVariable from '/@/components/variables/JetonVariable.vue';
import JetonMotClef from '/@/components/motsClefs/JetonMotClef.vue';
import TexteSurligneRecherche from './TexteSurlignéRecherche.vue';

import {constellation, suivre} from '/@/components/utils';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{
  résultat: types.résultatRecherche<
    | types.infoRésultatTexte
    | types.infoRésultatRecherche<types.infoRésultatTexte | types.infoRésultatVide>
    | types.infoRésultatVide
  >;
}>();

const constl = constellation();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Sources résultat directes (nom, description, id de la nuée)
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

// Sources objets connexes
const sourceObjetConnexe = (
  de: string,
): ComputedRef<
  | {
      id: string;
      info: types.infoRésultatRecherche<types.infoRésultatTexte>;
    }
  | undefined
> => {
  return computed(() => {
    const {de: sourceRésultat, clef, info} = props.résultat.résultatObjectif;
    if (info.type === 'résultat' && sourceRésultat === de && clef) {
      if (info.info.type === 'texte') {
        return {
          id: clef,
          info: {
            type: info.type,
            de: info.de,
            info: info.info,
          },
        };
      }
      return undefined;
    } else {
      return undefined;
    }
  });
};
const infoSourceVariable = sourceObjetConnexe('variable');
const infoSourceMotClef = sourceObjetConnexe('motClef');

// Nom
const noms = suivre(constl.nuées.suivreNomsNuée, {idNuée: props.résultat.id}, {});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Descriptions
const descriptions = suivre(constl.nuées.suivreDescriptionsNuée, {idNuée: props.résultat.id}, {});
const descriptionTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);

// Auteurs
const auteurs = suivre(constl.réseau.suivreAuteursNuée, {idNuée: props.résultat.id});
</script>
