<template>
  <selecteur-objet
    :multiples="multiples"
    :interdites="interdites"
    :resultats-recherche="résultats"
    :on-travaille="onTravaille"
    :texte-etiquette-recherche="t('projets.recherche.étiquette')"
    :texte-aucun-résultat="t('projets.recherche.aucunRésultat')"
    @selectionnee="ids => idsProjetsSélectionnées = ids"
    @requête-modifiee="(r) => requête = r"
  >
    <template #résultat="{résultat, click}">
      <ResultatRechercheProjet
        :résultat="résultat"
        @click="click"
      />
    </template>
    <template #jeton-objet="{id, deselectionner}">
      <carte-projet :id="id">
        <template #activator="{props: propsActivateur}">
          <jeton-projet
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
          </jeton-projet>
        </template>
      </carte-projet>
    </template>
    <template #nouveau="{nouveau}">
      <nouvelle-projet @nouveau="nouveau">
        <template #activator="{props: propsActivateur}">
          <v-list-item
            v-bind="propsActivateur"
            :title="t('projets.nouveau.btn')"
            prepend-icon="mdi-plus" 
          >
          </v-list-item>
        </template>
      </nouvelle-projet>
    </template>
  </selecteur-objet>
</template>
<script setup lang="ts">
import {ref, watchEffect} from 'vue';

import ResultatRechercheProjet from '/@/components/recherche/RésultatRechercheProjet.vue';
import SelecteurObjet from '/@/components/communs/SélecteurObjet.vue';

import {constellation, rechercher} from '/@/components/utils';

import JetonProjet from './JetonProjet.vue';
import CarteProjet from './CarteProjet.vue';
import NouvelleProjet from './NouvelleProjet.vue';
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';

defineProps<{multiples: boolean; interdites?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsProjets: string[]): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = constellation();

// Sélection
const idsProjetsSélectionnées = ref<string[]>([]);
watchEffect(() => {
  émettre('selectionnee', idsProjetsSélectionnées.value);
});

// Contrôles recherche
const requête = ref();
const {résultats, onTravaille} = rechercher({
  requête: requête,
  fRecherche: constl.recherche.rechercherProjetsSelonTexte,
  clefRequête: 'texte',
});
</script>
