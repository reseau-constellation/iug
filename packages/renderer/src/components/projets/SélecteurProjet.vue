<template>
  <selecteur-objet
    :multiples="multiples"
    :originaux="originaux"
    :resultats-recherche="résultats"
    :on-travaille="onTravaille"
    :texte-etiquette-recherche="t('projets.recherche.étiquette')"
    :texte-aucun-résultat="t('projets.recherche.aucunRésultat')"
    @selectionnee="ids => (idsProjetsSélectionnées = ids)"
    @requete-modifiee="r => (requête = r)"
  >
    <template #résultat="{résultat, click}">
      <ResultatRechercheProjet
        :résultat="résultat"
        @click="click"
      />
    </template>
    <template #jeton-objet="{id, deselectionner}">
      <carte-projet :id="id">
        <template #activateur="{props: propsActivateur}">
          <jeton-projet
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
          </jeton-projet>
        </template>
      </carte-projet>
    </template>
    <template #nouveau="{nouveau}">
      <nouveau-projet @nouveau="nouveau">
        <template #activateur="{props: propsActivateur}">
          <v-list-item
            v-bind="propsActivateur"
            :title="t('projets.nouveau.btn')"
            prepend-icon="mdi-plus"
          >
          </v-list-item>
        </template>
      </nouveau-projet>
    </template>
  </selecteur-objet>
</template>
<script setup lang="ts">
import {rechercher} from '@constl/vue';
import {ref, watchEffect} from 'vue';

import SelecteurObjet from '/@/components/communs/SélecteurObjet.vue';
import ResultatRechercheProjet from '/@/components/recherche/RésultatRechercheProjet.vue';

import {utiliserConstellation} from '/@/components/utils';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import CarteProjet from './CarteProjet.vue';
import JetonProjet from './JetonProjet.vue';
import NouveauProjet from './NouveauProjet.vue';

defineProps<{multiples: boolean; originaux?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionne', idsProjets: string[]): void;
}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const constl = utiliserConstellation();

// Sélection
const idsProjetsSélectionnées = ref<string[]>([]);
watchEffect(() => {
  émettre('selectionne', idsProjetsSélectionnées.value);
});

// Contrôles recherche
const requête = ref();
const {résultats, onTravaille} = rechercher(constl.recherche.rechercherProjetsSelonTexte, {
  texte: requête,
});
</script>
