<template>
  <v-list-item :prepend-icon="icône">
    <v-list-item-title>
      <TexteSurligneRecherche
        v-if="source === 'nom'"
        :info="résultat.résultatObjectif.info"
      />
      <span v-else>{{ nomTraduit || t('variables.aucunNom') }}</span>
    </v-list-item-title>
    <v-list-item-subtitle>
      <TexteSurligneRecherche
        v-if="source === 'descr'"
        :info="résultat.résultatObjectif.info"
      />
      <span v-else>{{ descriptionTraduite || t('variables.aucuneDescription') }}</span>
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
import type {ClientConstellation} from '@constl/ipa';

import type {types, variables} from '@constl/ipa';

import {computed, inject, ref} from 'vue';

import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import AuteursObjet from '/@/components/communs/AuteursObjet.vue';
import JetonIdObjet from '/@/components/communs/JetonIdObjet.vue';

import {enregistrerÉcoute} from '/@/components/utils';
import {icôneCatégorieVariable} from '/@/components/variables/utils';
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import TexteSurligneRecherche from './TexteSurlignéRecherche.vue';

const props = defineProps<{résultat: types.résultatRecherche<types.infoRésultatTexte>}>();

const constl = inject<ClientConstellation>('constl');

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

// Source résultat
const source = computed(() => {
  return props.résultat.résultatObjectif.de;
});

// Icône
const icône = computed(() =>
  catégorie.value ? icôneCatégorieVariable(catégorie.value) : 'mdi-variable',
);
const catégorie = ref<variables.catégorieVariables>();
enregistrerÉcoute(
  constl?.variables.suivreCatégorieVariable({
    idVariable: props.résultat.id,
    f: x => (catégorie.value = x),
  }),
);

// Nom
const noms = ref<{[lng: string]: string}>({});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

enregistrerÉcoute(
  constl?.variables.suivreNomsVariable({
    idVariable: props.résultat.id,
    f: x => (noms.value = x),
  }),
);

// Descriptions
const descriptions = ref<{[lng: string]: string}>({});
const descriptionTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);

enregistrerÉcoute(
  constl?.variables.suivreDescriptionsVariable({
    idVariable: props.résultat.id,
    f: x => (descriptions.value = x),
  }),
);

// Auteurs
const auteurs = ref<types.infoAuteur[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreAuteursVariable({
    idVariable: props.résultat.id,
    f: x => (auteurs.value = x),
  }),
);
</script>
