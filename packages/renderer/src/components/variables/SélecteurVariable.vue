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
    @requete-modifiee="r => (requête = r)"
  >
    <template #résultat="{résultat, click}">
      <ResultatRechercheVariable
        :résultat="résultat"
        @click="click"
      />
    </template>
    <template #jeton-objet="{id, deselectionner}">
      <carte-variable :id="id">
        <template #activateur="{props: propsActivateur}">
          <jeton-variable
            v-bind="{props: propsActivateur}"
            :id="id"
            class="me-1 mb-1"
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
        <template #activateur="{props: propsActivateur}">
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
import {rechercher} from '@constl/vue';
import {ref, watchEffect} from 'vue';

import SelecteurObjet from '/@/components/communs/SélecteurObjet.vue';
import ResultatRechercheVariable from '/@/components/recherche/RésultatRechercheVariable.vue';

import {utiliserConstellation} from '/@/components/utils';

import CarteVariable from './CarteVariable.vue';
import JetonVariable from './JetonVariable.vue';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {defineAsyncComponent} from 'vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NouvelleVariable = defineAsyncComponent(() => import('./NouvelleVariable.vue') as any);

defineProps<{multiples: boolean; originales?: string[]; interdites?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsVariables: string[]): void;
}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const constl = utiliserConstellation();

// Sélection
const idsVariablesSélectionnés = ref<string[]>([]);
watchEffect(() => {
  émettre('selectionnee', idsVariablesSélectionnés.value);
});

// Contrôles recherche
const requête = ref('');
const {résultats, onTravaille} = rechercher(constl.recherche.rechercherVariablesSelonTexte, {
  texte: requête,
});
</script>
