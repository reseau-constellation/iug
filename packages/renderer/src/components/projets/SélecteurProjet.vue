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
      <nouveau-projet @nouveau="nouveau">
        <template #activator="{props: propsActivateur}">
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
import {ref, watchEffect} from 'vue';

import ResultatRechercheProjet from '/@/components/recherche/RésultatRechercheProjet.vue';
import SelecteurObjet from '/@/components/communs/SélecteurObjet.vue';

import {constellation, rechercher} from '/@/components/utils';

import JetonProjet from './JetonProjet.vue';
import CarteProjet from './CarteProjet.vue';
import NouveauProjet from './NouveauProjet.vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

defineProps<{multiples: boolean; originaux?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionne', idsProjets: string[]): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = constellation();

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
