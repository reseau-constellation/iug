<template>
  <selecteur-objet
    :multiples="multiples"
    :interdits="interdites"
    :originaux="originales"
    :resultats-recherche="résultats"
    :on-travaille="onTravaille"
    :texte-etiquette-recherche="t('variables.recherche.étiquette')"
    :texte-aucun-résultat="t('variables.recherche.aucunRésultat')"
    @selectionnee="ids => (idsVariablesSélectionnés = ids)"
    @requête-modifiee="r => (requête = r)"
  >
    <template #résultat="{résultat, click}">
      <ResultatRechercheVariable
        :résultat="résultat"
        @click="click"
      />
    </template>
    <template #jeton-objet="{id, deselectionner}">
      <carte-variable :id="id">
        <template #activator="{props: propsActivateur}">
          <jeton-variable
            :id="id"
            v-bind="{props: propsActivateur}"
          >
            <v-icon
              class="ms-2"
              icon="mdi-close"
              size="small"
              variant="flat"
              @click="() => deselectionner({id})"
            />
          </jeton-variable>
        </template>
      </carte-variable>
    </template>
    <template #nouveau="{nouveau}">
      <nouvelle-variable @nouvelle="nouveau">
        <template #activator="{props: propsActivateur}">
          <v-list-item
            v-bind="propsActivateur"
            :title="t('variables.nouvelle.btn')"
            prepend-icon="mdi-plus"
          >
          </v-list-item>
        </template>
      </nouvelle-variable>
    </template>
  </selecteur-objet>
</template>
<script setup lang="ts">
import {ref, watchEffect} from 'vue';

import ResultatRechercheVariable from '/@/components/recherche/RésultatRechercheVariable.vue';
import SelecteurObjet from '/@/components/communs/SélecteurObjet.vue';

import {constellation, rechercher} from '/@/components/utils';

import NouvelleVariable from './NouvelleVariable.vue';
import JetonVariable from './JetonVariable.vue';
import CarteVariable from './CarteVariable.vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

defineProps<{multiples: boolean; originales?: string[]; interdites?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsVariables: string[]): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = constellation();

// Sélection
const idsVariablesSélectionnés = ref<string[]>([]);
watchEffect(() => {
  émettre('selectionnee', idsVariablesSélectionnés.value);
});

// Contrôles recherche
const requête = ref('');
const {résultats, onTravaille} = rechercher({
  requête: requête,
  fRecherche: constl.recherche.rechercherVariablesSelonTexte,
  clefRequête: 'texte',
});
</script>
